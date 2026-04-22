package com.hooppath.domain.enrollment.service;

import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.course.repository.LessonRepository;
import com.hooppath.domain.enrollment.dto.EnrollmentResponse;
import com.hooppath.domain.enrollment.entity.Enrollment;
import com.hooppath.domain.enrollment.repository.EnrollmentRepository;
import com.hooppath.domain.progress.repository.ProgressRepository;
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
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public EnrollmentResponse enroll(Long userId, Long courseId) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "ALREADY_ENROLLED", "이미 수강 신청한 강의입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "강의를 찾을 수 없습니다."));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);

        int lessonCount = lessonRepository.countByCourseId(courseId);
        return EnrollmentResponse.of(enrollment, lessonCount, 0.0);
    }

    @Transactional
    public void cancel(Long userId, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "수강 내역을 찾을 수 없습니다."));

        if (!enrollment.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "본인의 수강 내역만 취소할 수 있습니다.");
        }

        int progressCount = progressRepository.countByUserIdAndLessonCourseId(userId, enrollment.getCourse().getId());
        if (progressCount > 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "PROGRESS_EXISTS", "진도가 있는 강의는 취소할 수 없습니다.");
        }

        enrollmentRepository.delete(enrollment);
    }

    public List<EnrollmentResponse> getMyEnrollments(Long userId) {
        return enrollmentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(enrollment -> {
                    Long courseId = enrollment.getCourse().getId();
                    int lessonCount = lessonRepository.countByCourseId(courseId);
                    int completedCount = progressRepository.countByUserIdAndLessonCourseIdAndCompletedTrue(userId, courseId);
                    double completionRate = lessonCount > 0 ? (double) completedCount / lessonCount * 100 : 0.0;
                    return EnrollmentResponse.of(enrollment, lessonCount, completionRate);
                })
                .toList();
    }

    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}
