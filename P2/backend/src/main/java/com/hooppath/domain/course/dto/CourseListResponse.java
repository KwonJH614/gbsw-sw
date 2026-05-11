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
        String instructorName = null;
        if (course.getInstructor() != null && course.getInstructor().getUser() != null) {
            instructorName = course.getInstructor().getUser().getNickname();
        }
        return new CourseListResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getLevel().name(),
                instructorName,
                lessonCount,
                avgRating,
                reviewCount
        );
    }
}
