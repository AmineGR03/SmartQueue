package com.smartqueue.service.impl;

import com.smartqueue.dto.AppointmentDTO;
import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.ServiceEntity;
import com.smartqueue.entity.User;
import com.smartqueue.entity.enums.AppointmentStatus;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.AppointmentRepository;
import com.smartqueue.repository.ServiceEntityRepository;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository serviceEntityRepository;

    @Override
    public AppointmentDTO create(AppointmentDTO dto) {
        User user = userRepository.findById(dto.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ServiceEntity service = serviceEntityRepository.findById(dto.getService().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Appointment appointment = Appointment.builder()
                .appointmentDate(dto.getAppointmentDate())
                .status(dto.getStatus() != null ? dto.getStatus() : AppointmentStatus.PENDING)
                .notes(dto.getNotes())
                .user(user)
                .service(service)
                .build();

        Appointment saved = repository.save(appointment);
        return AppointmentDTO.fromEntity(saved);
    }

    @Override
    public List<AppointmentDTO> getAll() {
        return repository.findAll().stream()
                .map(AppointmentDTO::fromEntity)
                .toList();
    }

    @Override
    public void cancel(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found");
        }
        repository.deleteById(id);
    }
}
