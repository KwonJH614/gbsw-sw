package com.hooppath.domain.admin.dto;

import com.hooppath.domain.user.entity.User;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String email,
        String nickname,
        String role,
        boolean suspended,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(user.getId(), user.getEmail(), user.getNickname(),
                user.getRole().name(), user.isSuspended(), user.getCreatedAt());
    }
}
