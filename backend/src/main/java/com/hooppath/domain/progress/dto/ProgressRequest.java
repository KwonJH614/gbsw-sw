package com.hooppath.domain.progress.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ProgressRequest {
    @NotNull
    private Long lessonId;

    @Min(0)
    private int lastPosition;
}
