package com.smartqueue.service.impl;

import com.smartqueue.entity.Notification;
import com.smartqueue.entity.User;
import com.smartqueue.repository.NotificationRepository;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;

    @Override
    public List<Notification> getUserNotifications(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return repository.findByUser(user);
    }

    @Override
    public Notification create(Notification notification) {
        return repository.save(notification);
    }
}