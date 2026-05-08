package com.smartqueue.service;

import com.smartqueue.entity.Appointment;

import java.util.List;

public interface AppointmentService {

    Appointment create(Appointment appointment);

    List<Appointment> getAll();

    void cancel(Long id);
}