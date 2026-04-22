package com.hooppath.domain.qna.controller;

import com.hooppath.domain.qna.dto.AnswerRequest;
import com.hooppath.domain.qna.dto.AnswerResponse;
import com.hooppath.domain.qna.dto.QuestionRequest;
import com.hooppath.domain.qna.dto.QuestionResponse;
import com.hooppath.domain.qna.service.QnaService;
import com.hooppath.global.auth.CustomUserDetails;
import com.hooppath.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;

    // ── 질문 ──

    @GetMapping("/api/v1/courses/{courseId}/questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestions(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(qnaService.getQuestions(courseId)));
    }

    @PostMapping("/api/v1/courses/{courseId}/questions")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long courseId,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                qnaService.createQuestion(userDetails.getId(), courseId, request.getTitle(), request.getContent())
        ));
    }

    @PatchMapping("/api/v1/questions/{id}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                qnaService.updateQuestion(userDetails.getId(), id, request.getTitle(), request.getContent())
        ));
    }

    @DeleteMapping("/api/v1/questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        qnaService.deleteQuestion(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // ── 답변 ──

    @PostMapping("/api/v1/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                qnaService.createAnswer(userDetails.getId(), questionId, request.getContent())
        ));
    }

    @PatchMapping("/api/v1/answers/{id}")
    public ResponseEntity<ApiResponse<AnswerResponse>> updateAnswer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                qnaService.updateAnswer(userDetails.getId(), id, request.getContent())
        ));
    }

    @DeleteMapping("/api/v1/answers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnswer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        qnaService.deleteAnswer(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
