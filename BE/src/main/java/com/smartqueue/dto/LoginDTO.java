package com.smartqueue.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Legacy/general-purpose login payload (same shape as {@link com.smartqueue.dto.auth.LoginRequest}).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
