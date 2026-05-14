package com.smartqueue.service.impl;

import com.smartqueue.dto.AppointmentDTO;
import com.smartqueue.dto.NotificationCreateDTO;
import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.ServiceEntity;
import com.smartqueue.entity.User;
import com.smartqueue.entity.enums.AppointmentStatus;
import com.smartqueue.entity.enums.NotificationType;
import com.smartqueue.entity.enums.RoleName;
import com.smartqueue.exception.BadRequestException;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.AppointmentRepository;
import com.smartqueue.repository.ServiceEntityRepository;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.AppointmentService;
import com.smartqueue.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final AppointmentRepository repository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final NotificationService notificationService;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }

    @Override
    public AppointmentDTO create(AppointmentDTO dto) {
        User actor = currentUser();
        RoleName role = actor.getRole().getName();

        if (role == RoleName.AGENT) {
            throw new BadRequestException("Les agents ne peuvent pas créer de rendez-vous.");
        }

        User subject = userRepository.findById(dto.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ServiceEntity service = serviceEntityRepository.findById(dto.getService().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        AppointmentStatus status;
        if (role == RoleName.USER) {
            if (!subject.getId().equals(actor.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez réserver que pour vous-même.");
            }
            status = AppointmentStatus.PENDING;
        } else if (role == RoleName.ADMIN) {
            status = dto.getStatus() != null ? dto.getStatus() : AppointmentStatus.PENDING;
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Création de rendez-vous non autorisée.");
        }

        Appointment appointment = Appointment.builder()
                .appointmentDate(dto.getAppointmentDate())
                .status(status)
                .notes(dto.getNotes())
                .user(subject)
                .service(service)
                .build();

        Appointment saved = repository.save(appointment);
        return AppointmentDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> listForCurrentUser() {
        User actor = currentUser();
        RoleName role = actor.getRole().getName();
        if (role == RoleName.ADMIN || role == RoleName.AGENT) {
            return repository.findAll().stream()
                    .map(AppointmentDTO::fromEntity)
                    .toList();
        }
        return repository.findByUser(actor).stream()
                .map(AppointmentDTO::fromEntity)
                .toList();
    }

    @Override
    public void cancel(Long id) {
        User actor = currentUser();
        RoleName role = actor.getRole().getName();

        if (role == RoleName.AGENT) {
            throw new BadRequestException("Les agents ne peuvent pas annuler un rendez-vous usager.");
        }

        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (role == RoleName.USER && !appointment.getUser().getId().equals(actor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez annuler que vos propres rendez-vous.");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            return;
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        repository.save(appointment);
    }

    @Override
    public AppointmentDTO confirm(Long id) {
        User actor = currentUser();
        RoleName role = actor.getRole().getName();
        if (role != RoleName.ADMIN && role != RoleName.AGENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seuls les agents et administrateurs peuvent confirmer.");
        }

        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Seuls les rendez-vous en attente (PENDING) peuvent être confirmés.");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = repository.save(appointment);

        User owner = appointment.getUser();
        String when = appointment.getAppointmentDate() != null
                ? DT_FMT.format(appointment.getAppointmentDate())
                : "—";
        notificationService.create(NotificationCreateDTO.builder()
                .message("Votre rendez-vous du " + when + " a été confirmé par un agent.")
                .type(NotificationType.SUCCESS)
                .read(false)
                .user(NotificationCreateDTO.UserRef.builder().id(owner.getId()).build())
                .build());

        return AppointmentDTO.fromEntity(saved);
    }
}
