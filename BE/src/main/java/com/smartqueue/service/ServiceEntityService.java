package com.smartqueue.service;

import com.smartqueue.dto.ServiceDTO;

import java.util.List;

public interface ServiceEntityService {

    ServiceDTO create(ServiceDTO service);

    List<ServiceDTO> getAll();

    ServiceDTO getById(Long id);

    void delete(Long id);
}
