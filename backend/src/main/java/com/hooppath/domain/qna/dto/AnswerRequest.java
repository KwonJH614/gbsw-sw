package com.hooppath.domain.qna.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AnswerRequest {
    @NotBlank
    private String content;
}
