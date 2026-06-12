package com.hooppath.domain.progress.dto;

import com.hooppath.domain.progress.entity.Progress;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProgressResponse {
    private Long lessonId;
    private String lessonTitle;
    private int orderIndex;
    private int lastPosition;
    private int duration;
    private boolean completed;

    public static ProgressResponse from(Progress progress) {
        return new ProgressResponse(
                progress.getLesson().getId(),
                progress.getLesson().getTitle(),
                progress.getLesson().getOrderIndex(),
                progress.getLastPosition(),
                progress.getLesson().getDuration(),
                progress.isCompleted()
        );
    }
}
