package com.smartqueue.service.impl;

import com.smartqueue.dto.NotificationCreateDTO;
import com.smartqueue.dto.NotificationDTO;
import com.smartqueue.entity.Notification;
import com.smartqueue.entity.User;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.NotificationRepository;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUserNotifications(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return repository.findByUser(user).stream()
                .map(NotificationDTO::fromEntity)
                .toList();
    }

    @Override
    public NotificationDTO create(NotificationCreateDTO dto) {
        User user = userRepository.findById(dto.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .message(dto.getMessage())
                .type(dto.getType())
                .read(dto.getRead() != null ? dto.getRead() : Boolean.FALSE)
                .user(user)
                .build();

        Notification saved = repository.save(notification);
        return NotificationDTO.fromEntity(saved);
    }
}
