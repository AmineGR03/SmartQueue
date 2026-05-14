package com.smartqueue.service;

import com.smartqueue.dto.UserDTO;
import com.smartqueue.dto.auth.AuthResponse;
import com.smartqueue.dto.auth.LoginRequest;
import com.smartqueue.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserDTO getProfile(String email);
}
