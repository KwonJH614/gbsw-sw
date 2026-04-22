package com.hooppath.domain.course.repository;

import com.hooppath.domain.course.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    int countByCourseId(Long courseId);
}
