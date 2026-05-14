package com.smartqueue.service;

import com.smartqueue.dto.TicketResponseDTO;

import java.util.List;

public interface TicketService {

    TicketResponseDTO createTicket(Long userId, Long serviceId);

    TicketResponseDTO createAnonymousTicket(Long serviceId);

    List<TicketResponseDTO> getAllTickets();

    TicketResponseDTO callNextTicket();

    TicketResponseDTO completeTicket(Long ticketId);
}
