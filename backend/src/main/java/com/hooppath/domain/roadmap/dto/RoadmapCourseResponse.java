package com.hooppath.domain.roadmap.dto;

import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.roadmap.entity.RoadmapCourse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoadmapCourseResponse {
    private Long courseId;
    private String title;
    private String thumbnailUrl;
    private String level;
    private String instructorName;
    private int orderIndex;
    private int lessonCount;

    public static RoadmapCourseResponse of(RoadmapCourse rc, int lessonCount) {
        Course course = rc.getCourse();
        return new RoadmapCourseResponse(
                course.getId(),
                course.getTitle(),
                course.getThumbnailUrl(),
                course.getLevel().name(),
                course.getInstructor().getUser().getNickname(),
                rc.getOrderIndex(),
                lessonCount
        );
    }
}
