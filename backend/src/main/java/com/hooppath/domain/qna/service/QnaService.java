package com.hooppath.domain.qna.service;

import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.enrollment.repository.EnrollmentRepository;
import com.hooppath.domain.qna.dto.AnswerResponse;
import com.hooppath.domain.qna.dto.QuestionResponse;
import com.hooppath.domain.qna.entity.Answer;
import com.hooppath.domain.qna.entity.Question;
import com.hooppath.domain.qna.repository.AnswerRepository;
import com.hooppath.domain.qna.repository.QuestionRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QnaService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<QuestionResponse> getQuestions(Long courseId) {
        return questionRepository.findByCourseIdOrderByCreatedAtDesc(courseId).stream()
                .map(QuestionResponse::from)
                .toList();
    }

    @Transactional
    public QuestionResponse createQuestion(Long userId, Long courseId, String title, String content) {
        if (!enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "NOT_ENROLLED", "수강생만 질문을 작성할 수 있습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "강의를 찾을 수 없습니다."));

        Question question = Question.builder()
                .user(user)
                .course(course)
                .title(title)
                .content(content)
                .build();

        questionRepository.save(question);
        return QuestionResponse.from(question);
    }

    @Transactional
    public QuestionResponse updateQuestion(Long userId, Long questionId, String title, String content) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "질문을 찾을 수 없습니다."));

        if (!question.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 질문만 수정할 수 있습니다.");
        }

        question.update(title, content);
        return QuestionResponse.from(question);
    }

    @Transactional
    public void deleteQuestion(Long userId, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "질문을 찾을 수 없습니다."));

        if (!question.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 질문만 삭제할 수 있습니다.");
        }

        questionRepository.delete(question);
    }

    @Transactional
    public AnswerResponse createAnswer(Long userId, Long questionId, String content) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "질문을 찾을 수 없습니다."));

        Long courseId = question.getCourse().getId();
        if (!enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "NOT_ENROLLED", "수강생만 답변을 작성할 수 있습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));

        Answer answer = Answer.builder()
                .question(question)
                .user(user)
                .content(content)
                .build();

        answerRepository.save(answer);
        return AnswerResponse.from(answer);
    }

    @Transactional
    public AnswerResponse updateAnswer(Long userId, Long answerId, String content) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "답변을 찾을 수 없습니다."));

        if (!answer.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 답변만 수정할 수 있습니다.");
        }

        answer.update(content);
        return AnswerResponse.from(answer);
    }

    @Transactional
    public void deleteAnswer(Long userId, Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "답변을 찾을 수 없습니다."));

        if (!answer.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 답변만 삭제할 수 있습니다.");
        }

        answerRepository.delete(answer);
    }
}
