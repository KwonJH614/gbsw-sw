package com.hooppath.domain.admin.controller;

import com.hooppath.domain.admin.dto.AdminUserResponse;
import com.hooppath.domain.admin.service.AdminUserService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean suspended,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.list(q, role, suspended, page, size)));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<Map<String, Object>> changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        service.changeRole(id, body.get("role"), userDetails.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/{id}/suspend")
    public ResponseEntity<Map<String, Object>> suspend(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        service.setSuspended(id, body.get("suspended"), userDetails.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
