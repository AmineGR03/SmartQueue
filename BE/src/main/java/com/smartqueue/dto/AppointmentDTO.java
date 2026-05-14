package com.smartqueue.dto;

import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.enums.AppointmentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;

    @NotNull(message = "appointmentDate is required")
    private LocalDateTime appointmentDate;

    private AppointmentStatus status;

    private String notes;

    private LocalDateTime createdAt;

    @Valid
    @NotNull(message = "user is required")
    private UserRef user;

    @Valid
    @NotNull(message = "service is required")
    private ServiceRef service;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserRef {

        @NotNull(message = "user.id is required")
        private Long id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceRef {

        @NotNull(message = "service.id is required")
        private Long id;

        private String name;
    }

    public static AppointmentDTO fromEntity(Appointment a) {
        if (a == null) {
            return null;
        }
        UserRef userRef = null;
        if (a.getUser() != null) {
            userRef = UserRef.builder().id(a.getUser().getId()).build();
        }
        ServiceRef serviceRef = null;
        if (a.getService() != null) {
            var s = a.getService();
            serviceRef = ServiceRef.builder().id(s.getId()).name(s.getName()).build();
        }
        return AppointmentDTO.builder()
                .id(a.getId())
                .appointmentDate(a.getAppointmentDate())
                .status(a.getStatus())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .user(userRef)
                .service(serviceRef)
                .build();
    }
}
