package com.hooppath.domain.enrollment.dto;

import com.hooppath.domain.enrollment.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseThumbnailUrl;
    private String level;
    private String instructorName;
    private int lessonCount;
    private double completionRate;

    public static EnrollmentResponse of(Enrollment enrollment, int lessonCount, double completionRate) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getCourse().getThumbnailUrl(),
                enrollment.getCourse().getLevel().name(),
                enrollment.getCourse().getInstructor().getUser().getNickname(),
                lessonCount,
                completionRate
        );
    }
}
