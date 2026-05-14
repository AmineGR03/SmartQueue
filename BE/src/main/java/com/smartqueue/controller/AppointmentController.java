package com.smartqueue.controller;

import com.smartqueue.dto.AppointmentDTO;
import com.smartqueue.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    public AppointmentDTO create(@RequestBody @Valid AppointmentDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<AppointmentDTO> list() {
        return service.listForCurrentUser();
    }

    @PutMapping("/{id}/confirm")
    public AppointmentDTO confirm(@PathVariable Long id) {
        return service.confirm(id);
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id) {
        service.cancel(id);
    }
}
