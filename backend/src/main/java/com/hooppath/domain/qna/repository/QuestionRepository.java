package com.hooppath.domain.qna.repository;

import com.hooppath.domain.qna.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    int countByCourseId(Long courseId);
}
