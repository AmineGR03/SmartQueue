package com.smartqueue.controller;

import com.smartqueue.dto.NotificationCreateDTO;
import com.smartqueue.dto.NotificationDTO;
import com.smartqueue.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return service.getUserNotifications(userId);
    }

    @PostMapping
    public NotificationDTO create(@RequestBody @Valid NotificationCreateDTO dto) {
        return service.create(dto);
    }
}
