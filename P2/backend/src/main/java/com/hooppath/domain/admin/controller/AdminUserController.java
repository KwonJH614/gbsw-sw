package com.hooppath.domain.admin.controller;

import com.hooppath.domain.admin.service.AdminUserService;
import com.hooppath.domain.user.entity.User;
import com.hooppath.global.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean suspended) {
        List<Map<String, Object>> data = service.list(q, role, suspended).stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(), "email", u.getEmail(), "nickname", u.getNickname(),
                        "role", u.getRole().name(), "suspended", u.isSuspended(),
                        "createdAt", u.getCreatedAt().toString()))
                .toList();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
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
