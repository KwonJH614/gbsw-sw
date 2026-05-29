package com.hooppath.domain.course.service;

import com.hooppath.domain.course.dto.CreateLessonRequest;
import com.hooppath.domain.course.dto.LessonResponse;
import com.hooppath.domain.course.dto.ReorderRequest;
import com.hooppath.domain.course.dto.UpdateLessonRequest;
import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.entity.Lesson;
import com.hooppath.domain.course.repository.LessonRepository;
import com.hooppath.domain.instructor.entity.Instructor;
import com.hooppath.domain.instructor.repository.InstructorRepository;
import com.hooppath.domain.progress.repository.ProgressRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;
    private final InstructorRepository instructorRepository;
    private final ProgressRepository progressRepository;
    private final CourseService courseService;

    @Transactional
    public LessonResponse create(Long courseId, CreateLessonRequest request, Long userId) {
        Course course = courseService.getOwnedCourse(courseId, userId);

        int maxOrder = lessonRepository.findMaxOrderIndexByCourseId(courseId);
        Lesson lesson = Lesson.create(
                course,
                request.getTitle(),
                request.getVideoUrl(),
                request.getDuration(),
                maxOrder + 1
        );
        lessonRepository.save(lesson);
        return LessonResponse.from(lesson);
    }

    @Transactional
    public LessonResponse update(Long lessonId, UpdateLessonRequest request, Long userId) {
        Lesson lesson = getOwnedLesson(lessonId, userId);
        lesson.update(request.getTitle(), request.getVideoUrl(), request.getDuration());
        return LessonResponse.from(lesson);
    }

    @Transactional
    public void delete(Long lessonId, Long userId) {
        Lesson lesson = getOwnedLesson(lessonId, userId);

        if (progressRepository.existsByLessonId(lessonId)) {
            throw new BusinessException(
                    HttpStatus.CONFLICT, "HAS_PROGRESS_RECORDS", "진도 기록이 있는 레슨은 삭제할 수 없습니다.");
        }

        Long courseId = lesson.getCourse().getId();
        lessonRepository.delete(lesson);
        lessonRepository.flush();
        reindexLessons(courseId);
    }

    @Transactional
    public List<LessonResponse> reorder(Long courseId, List<ReorderRequest> items, Long userId) {
        courseService.getOwnedCourse(courseId, userId);

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        Map<Long, Lesson> byId = lessons.stream()
                .collect(Collectors.toMap(Lesson::getId, l -> l));

        for (ReorderRequest item : items) {
            Lesson lesson = byId.get(item.getLessonId());
            if (lesson == null) {
                throw new BusinessException(
                        HttpStatus.BAD_REQUEST, "INVALID_LESSON", "해당 강의에 포함되지 않은 레슨입니다.");
            }
            lesson.updateOrderIndex(item.getOrderIndex());
        }

        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(LessonResponse::from)
                .toList();
    }

    @Transactional
    public void reindexLessons(Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        int index = 1;
        for (Lesson lesson : lessons) {
            lesson.updateOrderIndex(index++);
        }
    }

    public List<LessonResponse> listByCourseForOwner(Long courseId, Long userId) {
        courseService.getOwnedCourse(courseId, userId);
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(LessonResponse::from)
                .toList();
    }

    private Lesson getOwnedLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "레슨을 찾을 수 없습니다."));

        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.FORBIDDEN, "NOT_INSTRUCTOR", "강사 프로필이 존재하지 않습니다."));

        Course course = lesson.getCourse();
        if (course == null || !course.isOwnedBy(instructor.getId())) {
            throw new BusinessException(
                    HttpStatus.FORBIDDEN, "NOT_OWNER", "본인 강의의 레슨이 아닙니다.");
        }

        return lesson;
    }
}
