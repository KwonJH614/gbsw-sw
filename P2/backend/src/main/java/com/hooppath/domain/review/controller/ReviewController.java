package com.hooppath.domain.review.controller;

import com.hooppath.domain.review.dto.ReviewListResponse;
import com.hooppath.domain.review.dto.ReviewRequest;
import com.hooppath.domain.review.dto.ReviewResponse;
import com.hooppath.domain.review.service.ReviewService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/v1/courses/{courseId}/reviews")
    public ResponseEntity<ApiResponse<ReviewListResponse>> getList(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getList(courseId)));
    }

    @PostMapping("/api/v1/courses/{courseId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> create(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                reviewService.create(userDetails.getId(), courseId, request.getRating(), request.getContent())
        ));
    }

    @PatchMapping("/api/v1/reviews/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> update(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                reviewService.update(userDetails.getId(), id, request.getRating(), request.getContent())
        ));
    }

    @DeleteMapping("/api/v1/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        reviewService.delete(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
