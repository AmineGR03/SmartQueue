package com.smartqueue.service;

import com.smartqueue.dto.auth.LoginRequest;
import com.smartqueue.dto.auth.RegisterRequest;
import com.smartqueue.dto.auth.AuthResponse;
import com.smartqueue.entity.User;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    User getProfile(String email);
}