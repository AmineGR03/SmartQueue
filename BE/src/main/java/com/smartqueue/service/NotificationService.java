package com.smartqueue.service;

import com.smartqueue.entity.Notification;

import java.util.List;

public interface NotificationService {

    List<Notification> getUserNotifications(Long userId);

    Notification create(Notification notification);
}