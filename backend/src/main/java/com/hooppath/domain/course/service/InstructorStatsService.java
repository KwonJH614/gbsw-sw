package com.hooppath.domain.course.service;

import com.hooppath.domain.course.dto.InstructorStatsResponse;
import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.enrollment.repository.EnrollmentRepository;
import com.hooppath.domain.instructor.entity.Instructor;
import com.hooppath.domain.instructor.repository.InstructorRepository;
import com.hooppath.domain.review.repository.ReviewRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InstructorStatsService {

    private final InstructorRepository instructorRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ReviewRepository reviewRepository;

    public InstructorStatsResponse getStats(Long userId) {
        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.FORBIDDEN, "NOT_INSTRUCTOR", "강사 프로필이 존재하지 않습니다."));

        List<Course> myCourses = courseRepository.findByInstructorIdOrderByCreatedAtDesc(instructor.getId());

        int courseCount = myCourses.size();
        int totalEnrollments = myCourses.stream()
                .mapToInt(c -> enrollmentRepository.countByCourseId(c.getId()))
                .sum();

        double avgRating = 0.0;
        if (!myCourses.isEmpty()) {
            double sum = myCourses.stream()
                    .mapToDouble(c -> reviewRepository.avgRatingByCourseId(c.getId()))
                    .sum();
            avgRating = sum / myCourses.size();
        }

        return new InstructorStatsResponse(courseCount, totalEnrollments, avgRating);
    }
}
