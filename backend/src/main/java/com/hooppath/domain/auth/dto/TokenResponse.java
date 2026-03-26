package com.hooppath.domain.auth.dto;

import com.hooppath.domain.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private UserResponse user;
}
