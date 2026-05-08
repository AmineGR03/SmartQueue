package com.smartqueue.service;

import com.smartqueue.entity.ServiceEntity;

import java.util.List;

public interface ServiceEntityService {

    ServiceEntity create(ServiceEntity service);

    List<ServiceEntity> getAll();

    ServiceEntity getById(Long id);

    void delete(Long id);
}