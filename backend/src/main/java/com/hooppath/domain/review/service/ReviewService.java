package com.hooppath.domain.review.service;

import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.course.repository.LessonRepository;
import com.hooppath.domain.progress.repository.ProgressRepository;
import com.hooppath.domain.review.dto.ReviewListResponse;
import com.hooppath.domain.review.dto.ReviewResponse;
import com.hooppath.domain.review.entity.Review;
import com.hooppath.domain.review.repository.ReviewRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public ReviewResponse create(Long userId, Long courseId, int rating, String content) {
        if (reviewRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "ALREADY_REVIEWED", "이미 리뷰를 작성한 강의입니다.");
        }

        int totalLessons = lessonRepository.countByCourseId(courseId);
        int completedLessons = progressRepository.countByUserIdAndLessonCourseIdAndCompletedTrue(userId, courseId);

        if (totalLessons == 0 || completedLessons < totalLessons) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "COURSE_NOT_COMPLETED", "수강 완료한 강의만 리뷰를 작성할 수 있습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "강의를 찾을 수 없습니다."));

        Review review = Review.builder()
                .user(user)
                .course(course)
                .rating(rating)
                .content(content)
                .build();

        reviewRepository.save(review);
        return ReviewResponse.from(review);
    }

    @Transactional
    public ReviewResponse update(Long userId, Long reviewId, int rating, String content) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 리뷰만 수정할 수 있습니다.");
        }

        review.update(rating, content);
        return ReviewResponse.from(review);
    }

    @Transactional
    public void delete(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 리뷰만 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);
    }

    public ReviewListResponse getList(Long courseId) {
        List<ReviewResponse> reviews = reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId).stream()
                .map(ReviewResponse::from)
                .toList();

        double avgRating = reviewRepository.avgRatingByCourseId(courseId);
        int reviewCount = reviewRepository.countByCourseId(courseId);

        return ReviewListResponse.of(avgRating, reviewCount, reviews);
    }
}
