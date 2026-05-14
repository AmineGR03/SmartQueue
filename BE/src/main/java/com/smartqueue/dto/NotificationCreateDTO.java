package com.smartqueue.dto;

import com.smartqueue.entity.enums.NotificationType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCreateDTO {

    @NotBlank(message = "message is required")
    private String message;

    @NotNull(message = "type is required")
    private NotificationType type;

    private Boolean read;

    @Valid
    @NotNull(message = "user is required")
    private UserRef user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserRef {

        @NotNull(message = "user.id is required")
        private Long id;
    }
}
