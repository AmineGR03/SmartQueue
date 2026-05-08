package com.smartqueue.service.impl;

import com.smartqueue.entity.ServiceEntity;
import com.smartqueue.repository.ServiceEntityRepository;
import com.smartqueue.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceEntityServiceImpl implements ServiceEntityService {

    private final ServiceEntityRepository repository;

    @Override
    public ServiceEntity create(ServiceEntity service) {
        return repository.save(service);
    }

    @Override
    public List<ServiceEntity> getAll() {
        return repository.findAll();
    }

    @Override
    public ServiceEntity getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}