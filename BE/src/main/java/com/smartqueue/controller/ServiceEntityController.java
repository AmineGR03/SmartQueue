package com.smartqueue.controller;

import com.smartqueue.entity.ServiceEntity;
import com.smartqueue.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceEntityController {

    private final ServiceEntityService service;

    @PostMapping
    public ServiceEntity create(@RequestBody ServiceEntity s) {
        return service.create(s);
    }

    @GetMapping
    public List<ServiceEntity> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ServiceEntity getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}