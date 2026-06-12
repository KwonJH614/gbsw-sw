package com.hooppath.domain.notification.controller;

import com.hooppath.domain.notification.dto.SubscriptionRequest;
import com.hooppath.domain.notification.dto.SubscriptionResponse;
import com.hooppath.domain.notification.service.NotificationSubscriptionService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications/subscription")
@RequiredArgsConstructor
public class NotificationSubscriptionController {

    private final NotificationSubscriptionService service;

    @GetMapping
    public ResponseEntity<ApiResponse<SubscriptionResponse>> get(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(service.get(userDetails.getId())));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<SubscriptionResponse>> subscribe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(service.subscribe(userDetails.getId(), request.webhookUrl())));
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<Void>> test(@AuthenticationPrincipal CustomUserDetails userDetails) {
        service.test(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> unsubscribe(@AuthenticationPrincipal CustomUserDetails userDetails) {
        service.unsubscribe(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
