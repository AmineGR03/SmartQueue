package com.smartqueue.controller;

import com.smartqueue.entity.Ticket;
import com.smartqueue.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> create(
            @RequestParam Long userId,
            @RequestParam Long serviceId) {

        return ResponseEntity.ok(
                ticketService.createTicket(userId, serviceId)
        );
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PutMapping("/call-next")
    public ResponseEntity<Ticket> callNext() {
        return ResponseEntity.ok(ticketService.callNextTicket());
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<Ticket> complete(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.completeTicket(id));
    }
}