package com.smartqueue.service;

import com.smartqueue.dto.NotificationCreateDTO;
import com.smartqueue.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    List<NotificationDTO> getUserNotifications(Long userId);

    NotificationDTO create(NotificationCreateDTO dto);
}
