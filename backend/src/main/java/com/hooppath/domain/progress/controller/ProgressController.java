package com.hooppath.domain.progress.controller;

import com.hooppath.domain.progress.dto.CourseProgressResponse;
import com.hooppath.domain.progress.dto.ProgressRequest;
import com.hooppath.domain.progress.dto.ProgressResponse;
import com.hooppath.domain.progress.service.ProgressService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProgressResponse>> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                progressService.save(userDetails.getId(), request.getLessonId(), request.getLastPosition())
        ));
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getCourseProgress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(
                progressService.getCourseProgress(userDetails.getId(), courseId)
        ));
    }
}
