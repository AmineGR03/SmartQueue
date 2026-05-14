package com.smartqueue.dto;

import com.smartqueue.entity.Notification;
import com.smartqueue.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private String message;
    private Boolean read;
    private NotificationType type;
    private LocalDateTime createdAt;
    private Long userId;

    public static NotificationDTO fromEntity(Notification n) {
        if (n == null) {
            return null;
        }
        return NotificationDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .read(n.getRead())
                .type(n.getType())
                .createdAt(n.getCreatedAt())
                .userId(n.getUser() != null ? n.getUser().getId() : null)
                .build();
    }
}
