package com.smartqueue.service.impl;

import com.smartqueue.config.WebSocketConfig;
import com.smartqueue.dto.TicketResponseDTO;
import com.smartqueue.entity.*;
import com.smartqueue.entity.enums.TicketStatus;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.*;
import com.smartqueue.service.TicketService;
import com.smartqueue.util.TicketGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository serviceRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public TicketResponseDTO createTicket(Long userId, Long serviceId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Ticket ticket = Ticket.builder()
                .number(TicketGenerator.nextNumber())
                .status(TicketStatus.WAITING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .service(service)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return TicketResponseDTO.fromEntity(saved);
    }

    @Override
    public TicketResponseDTO createAnonymousTicket(Long serviceId) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Ticket ticket = Ticket.builder()
                .number(TicketGenerator.nextNumber())
                .status(TicketStatus.WAITING)
                .createdAt(LocalDateTime.now())
                .user(null)
                .service(service)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return TicketResponseDTO.fromEntity(saved);
    }

    @Override
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(TicketResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public TicketResponseDTO callNextTicket() {

        Ticket ticket = ticketRepository
                .findFirstByStatusOrderByCreatedAtAsc(TicketStatus.WAITING)
                .orElseThrow(() -> new ResourceNotFoundException("No waiting ticket"));

        ticket.setStatus(TicketStatus.CALLED);

        ticket.setCalledAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return TicketResponseDTO.fromEntity(saved);
    }

    @Override
    public TicketResponseDTO completeTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setStatus(TicketStatus.COMPLETED);
        ticket.setCompletedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return TicketResponseDTO.fromEntity(saved);
    }

    private void broadcast(Ticket ticket) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("ticketId", ticket.getId());
        payload.put("number", ticket.getNumber());
        payload.put("status", ticket.getStatus() != null ? ticket.getStatus().name() : null);
        payload.put("serviceId", ticket.getService() != null ? ticket.getService().getId() : null);
        messagingTemplate.convertAndSend(WebSocketConfig.TICKET_TOPIC, (Object) payload);
    }
}
