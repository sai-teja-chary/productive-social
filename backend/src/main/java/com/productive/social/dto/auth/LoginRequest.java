package com.productive.social.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

//    @NotBlank
//    private String email; // You can later swap to username/email logic
    
    @NotBlank
    private String identifier;

    @NotBlank
    private String password;
    
    private String timezone;
    
    
}
