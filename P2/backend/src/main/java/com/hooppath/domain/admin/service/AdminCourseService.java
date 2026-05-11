package com.hooppath.domain.admin.service;

import com.hooppath.domain.course.entity.Course;
import com.hooppath.domain.course.repository.CourseRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCourseService {

    private final CourseRepository courseRepository;
    private final AdminAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<Course> list() {
        return courseRepository.findAll();
    }

    @Transactional
    public void setVisibility(Long courseId, boolean visible, Long adminId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "COURSE_NOT_FOUND", "강의를 찾을 수 없습니다."));
        course.setVisible(visible);
        auditLogService.record(adminId, visible ? "SHOW_COURSE" : "HIDE_COURSE", "COURSE", courseId, null);
    }
}
