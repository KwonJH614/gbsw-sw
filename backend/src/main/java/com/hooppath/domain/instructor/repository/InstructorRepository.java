package com.hooppath.domain.instructor.repository;

import com.hooppath.domain.instructor.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    Optional<Instructor> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
