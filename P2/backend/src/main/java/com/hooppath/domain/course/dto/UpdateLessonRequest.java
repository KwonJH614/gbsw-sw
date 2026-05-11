package com.hooppath.domain.course.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLessonRequest {
    private String title;
    private String videoUrl;
    private Integer duration;
}
