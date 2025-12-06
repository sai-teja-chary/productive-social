package com.productive.social.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String email; // You can later swap to username/email logic

    @NotBlank
    private String password;
}
