package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourseListResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String level;
    private String instructorName;
    private int lessonCount;
    private double avgRating;
    private int reviewCount;

    public static CourseListResponse of(Course course, int lessonCount, double avgRating, int reviewCount) {
        return new CourseListResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getLevel().name(),
                course.getInstructor().getUser().getNickname(),
                lessonCount,
                avgRating,
                reviewCount
        );
    }
}
