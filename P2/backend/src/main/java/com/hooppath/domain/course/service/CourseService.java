package com.hooppath.domain.course.service;

import com.hooppath.domain.course.dto.CourseDetailResponse;
import com.hooppath.domain.course.dto.CourseListResponse;
import com.hooppath.domain.course.dto.CreateCourseRequest;
import com.hooppath.domain.course.dto.InstructorCourseResponse;
import com.hooppath.domain.course.dto.LessonResponse;
import com.hooppath.domain.course.dto.UpdateCourseRequest;
import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.domain.course.repository.LessonRepository;
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
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorRepository instructorRepository;

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

    @Transactional
    public InstructorCourseResponse create(CreateCourseRequest request, Long userId) {
        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.FORBIDDEN, "NOT_INSTRUCTOR", "강사 프로필이 존재하지 않습니다."));

        Course course = Course.create(
                instructor,
                request.getTitle(),
                request.getDescription(),
                request.getThumbnailUrl(),
                request.getLevel()
        );
        courseRepository.save(course);

        return InstructorCourseResponse.of(course, 0, 0.0, 0);
    }

    @Transactional
    public InstructorCourseResponse update(Long courseId, UpdateCourseRequest request, Long userId) {
        Course course = getOwnedCourse(courseId, userId);

        course.update(
                request.getTitle(),
                request.getDescription(),
                request.getThumbnailUrl(),
                request.getLevel()
        );

        return buildInstructorCourseResponse(course);
    }

    @Transactional
    public void delete(Long courseId, Long userId) {
        Course course = getOwnedCourse(courseId, userId);

        if (enrollmentRepository.existsByCourseId(courseId)) {
            throw new BusinessException(
                    HttpStatus.CONFLICT, "HAS_ENROLLED_STUDENTS", "수강생이 있는 강의는 삭제할 수 없습니다.");
        }

        courseRepository.delete(course);
    }

    public List<InstructorCourseResponse> getMyCourses(Long userId) {
        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.FORBIDDEN, "NOT_INSTRUCTOR", "강사 프로필이 존재하지 않습니다."));

        return courseRepository.findByInstructorIdOrderByCreatedAtDesc(instructor.getId()).stream()
                .map(this::buildInstructorCourseResponse)
                .toList();
    }

    public Course getOwnedCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "NOT_FOUND", "강의를 찾을 수 없습니다."));

        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.FORBIDDEN, "NOT_INSTRUCTOR", "강사 프로필이 존재하지 않습니다."));

        if (!course.isOwnedBy(instructor.getId())) {
            throw new BusinessException(
                    HttpStatus.FORBIDDEN, "NOT_OWNER", "본인 강의가 아닙니다.");
        }

        return course;
    }

    private InstructorCourseResponse buildInstructorCourseResponse(Course course) {
        return InstructorCourseResponse.of(
                course,
                enrollmentRepository.countByCourseId(course.getId()),
                reviewRepository.avgRatingByCourseId(course.getId()),
                lessonRepository.countByCourseId(course.getId())
        );
    }
}
