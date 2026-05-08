package com.smartqueue.service.impl;

import com.smartqueue.entity.Appointment;
import com.smartqueue.repository.AppointmentRepository;
import com.smartqueue.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;

    @Override
    public Appointment create(Appointment appointment) {
        return repository.save(appointment);
    }

    @Override
    public List<Appointment> getAll() {
        return repository.findAll();
    }

    @Override
    public void cancel(Long id) {
        repository.deleteById(id);
    }
}