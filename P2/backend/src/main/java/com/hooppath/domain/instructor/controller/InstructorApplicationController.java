package com.hooppath.domain.instructor.controller;

import com.hooppath.domain.instructor.service.InstructorApplicationService;
import com.hooppath.global.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/instructor-applications")
@RequiredArgsConstructor
public class InstructorApplicationController {

    private final InstructorApplicationService service;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> apply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody InstructorApplicationService.ApplyRequest req) {
        return ResponseEntity.ok(Map.of("success", true, "data", service.apply(userDetails.getId(), req)));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyLatest(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(Map.of("success", true, "data", service.getMyLatest(userDetails.getId())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> list(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(Map.of("success", true, "data", service.list(status)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        service.approve(id, userDetails.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> body) {
        service.reject(id, userDetails.getId(), body.get("reason"));
        return ResponseEntity.ok(Map.of("success", true));
    }
}
