package com.smartqueue.controller;

import com.smartqueue.entity.Notification;
import com.smartqueue.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Long userId) {
        return service.getUserNotifications(userId);
    }

    @PostMapping
    public Notification create(@RequestBody Notification n) {
        return service.create(n);
    }
}