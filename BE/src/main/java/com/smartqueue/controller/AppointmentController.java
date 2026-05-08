package com.smartqueue.controller;

import com.smartqueue.entity.Appointment;
import com.smartqueue.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
        return service.create(a);
    }

    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id) {
        service.cancel(id);
    }
}