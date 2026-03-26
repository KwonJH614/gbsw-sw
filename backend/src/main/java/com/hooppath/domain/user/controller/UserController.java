package com.hooppath.domain.user.controller;

import com.hooppath.domain.user.dto.UpdateUserRequest;
import com.hooppath.domain.user.dto.UserResponse;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import com.hooppath.global.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));
        return ResponseEntity.ok(ApiResponse.ok(UserResponse.from(user)));
    }

    @PatchMapping("/me")
    @Transactional
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateUserRequest request) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));

        if (!user.getNickname().equals(request.getNickname())
                && userRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(HttpStatus.CONFLICT, "DUPLICATE_NICKNAME", "이미 사용 중인 닉네임입니다.");
        }

        user.updateNickname(request.getNickname());
        return ResponseEntity.ok(ApiResponse.ok(UserResponse.from(user)));
    }
}
