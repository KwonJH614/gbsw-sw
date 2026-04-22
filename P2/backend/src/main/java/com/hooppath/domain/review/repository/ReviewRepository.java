package com.hooppath.domain.review.repository;

import com.hooppath.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Review> findByUserIdAndCourseId(Long userId, Long courseId);
    int countByCourseId(Long courseId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.course.id = :courseId")
    double avgRatingByCourseId(@Param("courseId") Long courseId);
}
