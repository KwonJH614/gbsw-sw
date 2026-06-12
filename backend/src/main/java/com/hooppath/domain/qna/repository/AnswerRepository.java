package com.hooppath.domain.qna.repository;

import com.hooppath.domain.qna.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
