package com.smartqueue.dto;

import com.smartqueue.entity.Counter;
import com.smartqueue.entity.Ticket;
import com.smartqueue.entity.User;
import com.smartqueue.entity.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDTO {

    private Long id;
    private String number;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime calledAt;
    private LocalDateTime completedAt;
    private Boolean priority;
    private UserRef user;
    private ServiceRef service;
    private CounterRef counter;
    private AgentRef agent;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserRef {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceRef {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CounterRef {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AgentRef {
        private Long id;
        private String firstName;
        private String lastName;
    }

    public static TicketResponseDTO fromEntity(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        UserRef userRef = null;
        if (ticket.getUser() != null) {
            User u = ticket.getUser();
            userRef = UserRef.builder()
                    .id(u.getId())
                    .firstName(u.getFirstName())
                    .lastName(u.getLastName())
                    .email(u.getEmail())
                    .build();
        }
        ServiceRef serviceRef = null;
        if (ticket.getService() != null) {
            var s = ticket.getService();
            serviceRef = ServiceRef.builder()
                    .id(s.getId())
                    .name(s.getName())
                    .build();
        }
        CounterRef counterRef = null;
        if (ticket.getCounter() != null) {
            Counter c = ticket.getCounter();
            counterRef = CounterRef.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .build();
        }
        AgentRef agentRef = null;
        if (ticket.getAgent() != null) {
            User a = ticket.getAgent();
            agentRef = AgentRef.builder()
                    .id(a.getId())
                    .firstName(a.getFirstName())
                    .lastName(a.getLastName())
                    .build();
        }
        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .number(ticket.getNumber())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .calledAt(ticket.getCalledAt())
                .completedAt(ticket.getCompletedAt())
                .priority(ticket.getPriority())
                .user(userRef)
                .service(serviceRef)
                .counter(counterRef)
                .agent(agentRef)
                .build();
    }
}
