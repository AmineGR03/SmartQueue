package com.smartqueue.service;

import com.smartqueue.dto.AppointmentDTO;

import java.util.List;

public interface AppointmentService {

    AppointmentDTO create(AppointmentDTO dto);

    List<AppointmentDTO> getAll();

    void cancel(Long id);
}
