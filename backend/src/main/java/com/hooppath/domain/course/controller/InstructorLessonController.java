package com.hooppath.domain.course.controller;

import com.hooppath.domain.course.dto.CreateLessonRequest;
import com.hooppath.domain.course.dto.LessonResponse;
import com.hooppath.domain.course.dto.ReorderRequest;
import com.hooppath.domain.course.dto.UpdateLessonRequest;
import com.hooppath.domain.course.service.LessonService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
public class InstructorLessonController {

    private final LessonService lessonService;

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> listLessons(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.listByCourseForOwner(courseId, userDetails.getId())));
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId,
            @Valid @RequestBody CreateLessonRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.create(courseId, request, userDetails.getId())));
    }

    @PatchMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateLessonRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.update(id, request, userDetails.getId())));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        lessonService.delete(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PatchMapping("/courses/{courseId}/lessons/reorder")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> reorderLessons(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId,
            @Valid @RequestBody List<ReorderRequest> items) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.reorder(courseId, items, userDetails.getId())));
    }
}
