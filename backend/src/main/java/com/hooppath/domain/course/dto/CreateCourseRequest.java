package com.hooppath.domain.course.dto;

import com.hooppath.domain.course.entity.Level;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {

    @NotBlank
    private String title;

    private String description;

    private String thumbnailUrl;

    @NotNull
    private Level level;
}
