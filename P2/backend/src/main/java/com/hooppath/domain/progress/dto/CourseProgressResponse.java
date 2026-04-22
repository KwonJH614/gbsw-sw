package com.hooppath.domain.progress.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CourseProgressResponse {
    private Long courseId;
    private int totalLessons;
    private int completedLessons;
    private double completionRate;
    private List<ProgressResponse> lessons;

    public static CourseProgressResponse of(Long courseId, int totalLessons,
                                             int completedLessons, List<ProgressResponse> lessons) {
        double rate = totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0.0;
        return new CourseProgressResponse(courseId, totalLessons, completedLessons, rate, lessons);
    }
}
