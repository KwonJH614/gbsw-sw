package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Lesson;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonResponse {
    private Long id;
    private String title;
    private String videoUrl;
    private Integer duration;
    private Integer orderIndex;

    public static LessonResponse from(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getVideoUrl(),
                lesson.getDuration(),
                lesson.getOrderIndex()
        );
    }
}
