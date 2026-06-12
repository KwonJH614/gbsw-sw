package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InstructorCourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String level;
    private int enrollmentCount;
    private double avgRating;
    private int lessonCount;

    public static InstructorCourseResponse of(Course course, int enrollmentCount, double avgRating, int lessonCount) {
        return new InstructorCourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getLevel().name(),
                enrollmentCount,
                avgRating,
                lessonCount
        );
    }
}
