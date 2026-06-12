package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Level;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseRequest {
    private String title;
    private String description;
    private String thumbnailUrl;
    private Level level;
}
