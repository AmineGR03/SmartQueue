package com.smartqueue.service;

import com.smartqueue.dto.UserDTO;

import java.util.List;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    void deleteUser(Long id);

    UserDTO updateUser(Long id, UserDTO updates);
}
