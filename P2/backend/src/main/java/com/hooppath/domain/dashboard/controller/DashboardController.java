package com.hooppath.domain.dashboard.controller;

import com.hooppath.domain.dashboard.service.DashboardService;
import com.hooppath.global.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> overview(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(Map.of("success", true, "data", service.getOverview(userDetails.getId())));
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> activities(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true, "data", service.getActivities(userDetails.getId(), Math.min(limit, 30))));
    }
}
