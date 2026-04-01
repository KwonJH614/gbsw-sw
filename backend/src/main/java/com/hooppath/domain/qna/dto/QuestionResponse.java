package com.hooppath.domain.qna.dto;

import com.hooppath.domain.qna.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private Long userId;
    private String nickname;
    private String title;
    private String content;
    private int answerCount;
    private List<AnswerResponse> answers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static QuestionResponse from(Question question) {
        List<AnswerResponse> answers = question.getAnswers().stream()
                .map(AnswerResponse::from)
                .toList();

        return new QuestionResponse(
                question.getId(),
                question.getUser().getId(),
                question.getUser().getNickname(),
                question.getTitle(),
                question.getContent(),
                answers.size(),
                answers,
                question.getCreatedAt(),
                question.getUpdatedAt()
        );
    }
}
