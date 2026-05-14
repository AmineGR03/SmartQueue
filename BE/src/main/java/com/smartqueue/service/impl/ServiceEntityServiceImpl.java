package com.smartqueue.service.impl;

import com.smartqueue.dto.ServiceDTO;
import com.smartqueue.entity.ServiceEntity;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.ServiceEntityRepository;
import com.smartqueue.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceEntityServiceImpl implements ServiceEntityService {

    private final ServiceEntityRepository repository;

    @Override
    public ServiceDTO create(ServiceDTO service) {
        ServiceEntity saved = repository.save(service.toNewEntity());
        return ServiceDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getAll() {
        return repository.findAll().stream()
                .map(ServiceDTO::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceDTO getById(Long id) {
        ServiceEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return ServiceDTO.fromEntity(entity);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found");
        }
        repository.deleteById(id);
    }
}
