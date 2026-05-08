package com.smartqueue.service;

import com.smartqueue.dto.auth.LoginRequest;
import com.smartqueue.dto.auth.RegisterRequest;
import com.smartqueue.dto.auth.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}