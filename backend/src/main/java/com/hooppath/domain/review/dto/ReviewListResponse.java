package com.hooppath.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ReviewListResponse {
    private double avgRating;
    private int reviewCount;
    private List<ReviewResponse> reviews;

    public static ReviewListResponse of(double avgRating, int reviewCount, List<ReviewResponse> reviews) {
        return new ReviewListResponse(avgRating, reviewCount, reviews);
    }
}
