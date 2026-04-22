package com.hooppath.domain.qna.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class QuestionRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String content;
}
