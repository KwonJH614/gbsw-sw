package com.hooppath.domain.qna.dto;

import com.hooppath.domain.qna.entity.Answer;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AnswerResponse {
    private Long id;
    private Long userId;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnswerResponse from(Answer answer) {
        return new AnswerResponse(
                answer.getId(),
                answer.getUser().getId(),
                answer.getUser().getNickname(),
                answer.getContent(),
                answer.getCreatedAt(),
                answer.getUpdatedAt()
        );
    }
}
