package com.hooppath.domain.progress.service;

import com.hooppath.domain.course.entity.Lesson;
import com.hooppath.domain.course.repository.LessonRepository;
import com.hooppath.domain.enrollment.repository.EnrollmentRepository;
import com.hooppath.domain.progress.dto.CourseProgressResponse;
import com.hooppath.domain.progress.dto.ProgressResponse;
import com.hooppath.domain.progress.entity.Progress;
import com.hooppath.domain.progress.repository.ProgressRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public ProgressResponse save(Long userId, Long lessonId, int lastPosition) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "레슨을 찾을 수 없습니다."));

        if (!enrollmentRepository.existsByUserIdAndCourseId(userId, lesson.getCourse().getId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "NOT_ENROLLED", "수강 신청이 필요합니다.");
        }

        boolean completed = lesson.getDuration() > 0
                && ((double) lastPosition / lesson.getDuration()) >= 0.9;

        Optional<Progress> existing = progressRepository.findByUserIdAndLessonId(userId, lessonId);

        if (existing.isPresent()) {
            Progress progress = existing.get();
            progress.updateProgress(lastPosition, completed);
            return ProgressResponse.from(progress);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND", "사용자를 찾을 수 없습니다."));

        Progress progress = Progress.builder()
                .user(user)
                .lesson(lesson)
                .lastPosition(lastPosition)
                .completed(completed)
                .build();

        progressRepository.save(progress);
        return ProgressResponse.from(progress);
    }

    public CourseProgressResponse getCourseProgress(Long userId, Long courseId) {
        int totalLessons = lessonRepository.countByCourseId(courseId);
        List<Progress> progresses = progressRepository.findByUserIdAndLessonCourseId(userId, courseId);

        int completedLessons = (int) progresses.stream().filter(Progress::isCompleted).count();

        List<ProgressResponse> lessonProgresses = progresses.stream()
                .map(ProgressResponse::from)
                .toList();

        return CourseProgressResponse.of(courseId, totalLessons, completedLessons, lessonProgresses);
    }

    public Optional<Progress> getLessonProgress(Long userId, Long lessonId) {
        return progressRepository.findByUserIdAndLessonId(userId, lessonId);
    }
}
