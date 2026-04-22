package com.hooppath.domain.roadmap.service;

import com.hooppath.domain.course.repository.LessonRepository;
import com.hooppath.domain.enrollment.repository.EnrollmentRepository;
import com.hooppath.domain.progress.repository.ProgressRepository;
import com.hooppath.domain.roadmap.dto.RoadmapCourseResponse;
import com.hooppath.domain.roadmap.dto.RoadmapDetailResponse;
import com.hooppath.domain.roadmap.dto.RoadmapListResponse;
import com.hooppath.domain.roadmap.dto.RoadmapProgressResponse;
import com.hooppath.domain.roadmap.entity.Roadmap;
import com.hooppath.domain.roadmap.entity.RoadmapCourse;
import com.hooppath.domain.roadmap.repository.RoadmapCourseRepository;
import com.hooppath.domain.roadmap.repository.RoadmapRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final RoadmapCourseRepository roadmapCourseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;

    public List<RoadmapListResponse> getList() {
        return roadmapRepository.findAll().stream()
                .map(roadmap -> RoadmapListResponse.of(
                        roadmap,
                        roadmap.getRoadmapCourses().size()
                ))
                .toList();
    }

    public RoadmapDetailResponse getDetail(Long id) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "로드맵을 찾을 수 없습니다."));

        List<RoadmapCourse> roadmapCourses = roadmapCourseRepository
                .findByRoadmapIdOrderByOrderIndexAsc(id);

        List<RoadmapCourseResponse> courses = roadmapCourses.stream()
                .map(rc -> RoadmapCourseResponse.of(
                        rc,
                        lessonRepository.countByCourseId(rc.getCourse().getId())
                ))
                .toList();

        return RoadmapDetailResponse.of(roadmap, courses);
    }

    public RoadmapProgressResponse getProgress(Long userId, Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "로드맵을 찾을 수 없습니다."));

        List<RoadmapCourse> roadmapCourses = roadmapCourseRepository
                .findByRoadmapIdOrderByOrderIndexAsc(roadmapId);

        List<RoadmapProgressResponse.CourseProgressItem> items = new ArrayList<>();
        int completedCourses = 0;

        for (RoadmapCourse rc : roadmapCourses) {
            Long courseId = rc.getCourse().getId();
            int totalLessons = lessonRepository.countByCourseId(courseId);
            boolean enrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
            int completedLessons = progressRepository.countByUserIdAndLessonCourseIdAndCompletedTrue(userId, courseId);
            double rate = totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0.0;

            if (totalLessons > 0 && completedLessons == totalLessons) {
                completedCourses++;
            }

            items.add(new RoadmapProgressResponse.CourseProgressItem(
                    courseId, rc.getCourse().getTitle(), totalLessons,
                    completedLessons, rate, enrolled
            ));
        }

        int totalCourses = roadmapCourses.size();
        double overallRate = totalCourses > 0 ? (double) completedCourses / totalCourses * 100 : 0.0;

        return new RoadmapProgressResponse(roadmapId, totalCourses, completedCourses, overallRate, items);
    }
}
