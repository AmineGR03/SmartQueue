package com.smartqueue.service;

import com.smartqueue.entity.Ticket;

import java.util.List;

public interface TicketService {

    Ticket createTicket(Long userId, Long serviceId);

    List<Ticket> getAllTickets();

    Ticket callNextTicket();

    Ticket completeTicket(Long ticketId);
}