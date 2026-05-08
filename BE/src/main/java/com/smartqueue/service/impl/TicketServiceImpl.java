package com.smartqueue.service.impl;

import com.smartqueue.entity.*;
import com.smartqueue.entity.enums.TicketStatus;
import com.smartqueue.repository.*;
import com.smartqueue.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository serviceRepository;

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

        return ticketRepository.save(ticket);
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

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket completeTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.COMPLETED);
        ticket.setCompletedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}