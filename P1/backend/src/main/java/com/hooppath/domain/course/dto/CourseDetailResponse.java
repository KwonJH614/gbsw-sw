package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CourseDetailResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String level;
    private InstructorResponse instructor;
    private List<LessonResponse> lessons;
    private double avgRating;
    private int reviewCount;

    public static CourseDetailResponse of(Course course, List<LessonResponse> lessons,
                                          double avgRating, int reviewCount) {
        return new CourseDetailResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getLevel().name(),
                InstructorResponse.from(course.getInstructor()),
                lessons,
                avgRating,
                reviewCount
        );
    }
}
