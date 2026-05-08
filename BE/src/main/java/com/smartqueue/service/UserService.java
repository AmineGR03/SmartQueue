package com.smartqueue.service;

import com.smartqueue.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    void deleteUser(Long id);
}