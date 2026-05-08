package com.smartqueue.repository;

import com.smartqueue.entity.Ticket;
import com.smartqueue.entity.User;
import com.smartqueue.entity.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByNumber(String number);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByUser(User user);

    List<Ticket> findByAgent(User agent);
    Optional<Ticket> findFirstByStatusOrderByCreatedAtAsc(TicketStatus status);
}