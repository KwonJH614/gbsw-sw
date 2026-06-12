package com.hooppath.domain.course.controller;

import com.hooppath.domain.course.dto.CreateCourseRequest;
import com.hooppath.domain.course.dto.InstructorCourseResponse;
import com.hooppath.domain.course.dto.InstructorStatsResponse;
import com.hooppath.domain.course.dto.UpdateCourseRequest;
import com.hooppath.domain.course.service.CourseService;
import com.hooppath.domain.course.service.InstructorStatsService;
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
public class InstructorCourseController {

    private final CourseService courseService;
    private final InstructorStatsService instructorStatsService;

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<InstructorCourseResponse>>> getMyCourses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getMyCourses(userDetails.getId())));
    }

    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<InstructorCourseResponse>> createCourse(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.create(request, userDetails.getId())));
    }

    @PatchMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<InstructorCourseResponse>> updateCourse(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.update(id, request, userDetails.getId())));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        courseService.delete(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<InstructorStatsResponse>> getStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(instructorStatsService.getStats(userDetails.getId())));
    }
}
