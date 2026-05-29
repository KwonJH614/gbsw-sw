package com.hooppath.domain.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String videoUrl;

    @NotNull
    @PositiveOrZero
    private Integer duration;
}
