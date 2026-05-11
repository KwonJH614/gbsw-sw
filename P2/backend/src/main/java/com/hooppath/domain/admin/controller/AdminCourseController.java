package com.hooppath.domain.admin.controller;

import com.hooppath.domain.admin.service.AdminCourseService;
import com.hooppath.domain.course.entity.Course;
import com.hooppath.global.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/courses")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminCourseController {

    private final AdminCourseService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        List<Map<String, Object>> data = service.list().stream()
                .map(c -> Map.<String, Object>of(
                        "id", c.getId(), "title", c.getTitle(),
                        "instructorId", c.getInstructor().getId(),
                        "level", c.getLevel().name(),
                        "isVisible", c.isVisible(),
                        "createdAt", c.getCreatedAt().toString()))
                .toList();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<Map<String, Object>> setVisibility(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        service.setVisibility(id, body.get("visible"), userDetails.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
