package com.hooppath.domain.roadmap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RoadmapProgressResponse {
    private Long roadmapId;
    private int totalCourses;
    private int completedCourses;
    private double completionRate;
    private List<CourseProgressItem> courses;

    @Getter
    @AllArgsConstructor
    public static class CourseProgressItem {
        private Long courseId;
        private String title;
        private int totalLessons;
        private int completedLessons;
        private double completionRate;
        private boolean enrolled;
    }
}
