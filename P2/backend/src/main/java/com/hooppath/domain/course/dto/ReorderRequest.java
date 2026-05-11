package com.hooppath.domain.course.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReorderRequest {

    @NotNull
    private Long lessonId;

    @NotNull
    private Integer orderIndex;
}
