package com.smartqueue.service.impl;

import com.smartqueue.config.WebSocketConfig;
import com.smartqueue.entity.*;
import com.smartqueue.entity.enums.TicketStatus;
import com.smartqueue.repository.*;
import com.smartqueue.service.TicketService;
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
    public Ticket createTicket(Long userId, Long serviceId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Ticket ticket = Ticket.builder()
                .number("T-" + System.currentTimeMillis())
                .status(TicketStatus.WAITING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .service(service)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return saved;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket callNextTicket() {

        Ticket ticket = ticketRepository
                .findFirstByStatusOrderByCreatedAtAsc(TicketStatus.WAITING)
                .orElseThrow(() -> new RuntimeException("No ticket found"));

        ticket.setStatus(TicketStatus.CALLED);

        ticket.setCalledAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return saved;
    }

    @Override
    public Ticket completeTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.COMPLETED);
        ticket.setCompletedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        broadcast(saved);
        return saved;
    }

    private void broadcast(Ticket ticket) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("ticketId", ticket.getId());
        payload.put("number", ticket.getNumber());
        payload.put("status", ticket.getStatus() != null ? ticket.getStatus().name() : null);
        payload.put("serviceId", ticket.getService() != null ? ticket.getService().getId() : null);
        messagingTemplate.convertAndSend(WebSocketConfig.TICKET_TOPIC, payload);
    }
}