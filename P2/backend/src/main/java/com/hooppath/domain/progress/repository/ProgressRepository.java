package com.hooppath.domain.progress.repository;

import com.hooppath.domain.progress.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<Progress> findByUserIdAndLessonCourseId(Long userId, Long courseId);
    int countByUserIdAndLessonCourseId(Long userId, Long courseId);
    int countByUserIdAndLessonCourseIdAndCompletedTrue(Long userId, Long courseId);
}
