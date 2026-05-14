package com.smartqueue.controller;

import com.smartqueue.dto.TicketRequestDTO;
import com.smartqueue.dto.TicketResponseDTO;
import com.smartqueue.exception.BadRequestException;
import com.smartqueue.service.TicketService;
import jakarta.validation.Valid;
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
    public ResponseEntity<TicketResponseDTO> create(
            @RequestBody(required = false) @Valid TicketRequestDTO body,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long serviceId) {

        Long uId = userId;
        Long sId = serviceId;
        if (body != null) {
            if (body.getUserId() != null) {
                uId = body.getUserId();
            }
            if (body.getServiceId() != null) {
                sId = body.getServiceId();
            }
        }
        if (uId == null || sId == null) {
            throw new BadRequestException("userId and serviceId are required (query parameters or JSON body)");
        }

        return ResponseEntity.ok(
                ticketService.createTicket(uId, sId)
        );
    }

    @PostMapping("/anonymous")
    public ResponseEntity<TicketResponseDTO> createAnonymous(
            @RequestParam Long serviceId) {
        return ResponseEntity.ok(ticketService.createAnonymousTicket(serviceId));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/public")
    public ResponseEntity<List<TicketResponseDTO>> getAllPublic() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PutMapping("/call-next")
    public ResponseEntity<TicketResponseDTO> callNext() {
        return ResponseEntity.ok(ticketService.callNextTicket());
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<TicketResponseDTO> complete(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.completeTicket(id));
    }
}
