package com.smartqueue.repository;

import com.smartqueue.entity.Notification;
import com.smartqueue.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserAndRead(User user, Boolean read);
}