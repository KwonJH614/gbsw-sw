package com.hooppath.domain.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ReviewRequest {
    @Min(1)
    @Max(5)
    private int rating;

    @NotBlank
    private String content;
}
