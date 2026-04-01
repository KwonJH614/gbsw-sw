package com.hooppath.domain.enrollment.repository;

import com.hooppath.domain.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    List<Enrollment> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countByUserIdAndCourseId(Long userId, Long courseId);
}
