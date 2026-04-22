package com.hooppath.domain.course.controller;

import com.hooppath.domain.course.dto.CourseDetailResponse;
import com.hooppath.domain.course.dto.CourseListResponse;
import com.hooppath.domain.course.service.CourseService;
import com.hooppath.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseListResponse>>> getList() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getDetail(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CourseListResponse>>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.search(q)));
    }
}
