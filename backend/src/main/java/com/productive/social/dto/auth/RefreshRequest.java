package com.productive.social.dto.auth;

import lombok.Data;

@Data
public class RefreshRequest {
    private String refreshToken;
}
