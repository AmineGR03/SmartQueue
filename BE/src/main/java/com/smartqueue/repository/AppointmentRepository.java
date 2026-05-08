package com.smartqueue.repository;

import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.User;
import com.smartqueue.entity.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUser(User user);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByAppointmentDate(LocalDateTime appointmentDate);
}