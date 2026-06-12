package com.hooppath.domain.instructor.repository;

import com.hooppath.domain.instructor.entity.InstructorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, Long> {
    boolean existsByUserIdAndStatus(Long userId, InstructorApplication.ApplicationStatus status);
    Optional<InstructorApplication> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    List<InstructorApplication> findByStatusOrderByCreatedAtAsc(InstructorApplication.ApplicationStatus status);
}
