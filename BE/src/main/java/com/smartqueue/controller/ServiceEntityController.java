package com.smartqueue.controller;

import com.smartqueue.dto.ServiceDTO;
import com.smartqueue.service.ServiceEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceEntityController {

    private final ServiceEntityService service;

    @PostMapping
    public ServiceDTO create(@RequestBody @Valid ServiceDTO body) {
        return service.create(body);
    }

    @GetMapping
    public List<ServiceDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ServiceDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
