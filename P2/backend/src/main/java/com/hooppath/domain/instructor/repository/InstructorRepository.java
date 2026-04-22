package com.hooppath.domain.instructor.repository;

import com.hooppath.domain.instructor.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
}
