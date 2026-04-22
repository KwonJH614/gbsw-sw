package com.hooppath.domain.course.service;

import com.hooppath.domain.course.dto.CourseDetailResponse;
import com.hooppath.domain.course.dto.CourseListResponse;
import com.hooppath.domain.course.dto.LessonResponse;
import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.course.repository.LessonRepository;
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
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ReviewRepository reviewRepository;

    public List<CourseListResponse> getList() {
        return courseRepository.findAll().stream()
                .map(course -> CourseListResponse.of(
                        course,
                        lessonRepository.countByCourseId(course.getId()),
                        reviewRepository.avgRatingByCourseId(course.getId()),
                        reviewRepository.countByCourseId(course.getId())
                ))
                .toList();
    }

    public CourseDetailResponse getDetail(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "강의를 찾을 수 없습니다."));

        List<LessonResponse> lessons = lessonRepository
                .findByCourseIdOrderByOrderIndexAsc(id).stream()
                .map(LessonResponse::from)
                .toList();

        double avgRating = reviewRepository.avgRatingByCourseId(id);
        int reviewCount = reviewRepository.countByCourseId(id);

        return CourseDetailResponse.of(course, lessons, avgRating, reviewCount);
    }

    public List<CourseListResponse> search(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(course -> CourseListResponse.of(
                        course,
                        lessonRepository.countByCourseId(course.getId()),
                        reviewRepository.avgRatingByCourseId(course.getId()),
                        reviewRepository.countByCourseId(course.getId())
                ))
                .toList();
    }
}
