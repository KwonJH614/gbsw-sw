package com.hooppath.domain.enrollment.controller;

import com.hooppath.domain.enrollment.dto.EnrollmentResponse;
import com.hooppath.domain.enrollment.service.EnrollmentService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Long> body) {
        Long courseId = body.get("courseId");
        return ResponseEntity.ok(ApiResponse.ok(enrollmentService.enroll(userDetails.getId(), courseId)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(enrollmentService.getMyEnrollments(userDetails.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        enrollmentService.cancel(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkEnrollment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(enrollmentService.isEnrolled(userDetails.getId(), courseId)));
    }
}
