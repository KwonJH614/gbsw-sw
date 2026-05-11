package com.hooppath.domain.course.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InstructorStatsResponse {
    private int courseCount;
    private int totalEnrollmentCount;
    private double avgRating;
}
