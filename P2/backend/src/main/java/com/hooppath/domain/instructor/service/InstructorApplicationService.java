package com.hooppath.domain.instructor.service;

import com.hooppath.domain.admin.service.AdminAuditLogService;
import com.hooppath.domain.instructor.entity.Instructor;
import com.hooppath.domain.instructor.entity.InstructorApplication;
import com.hooppath.domain.instructor.entity.InstructorApplication.ApplicationStatus;
import com.hooppath.domain.instructor.repository.InstructorApplicationRepository;
import com.hooppath.domain.instructor.repository.InstructorRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import com.hooppath.global.exception.P2ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InstructorApplicationService {

    private final InstructorApplicationRepository applicationRepo;
    private final InstructorRepository instructorRepository;
    private final UserRepository userRepository;
    private final AdminAuditLogService auditLogService;

    @Transactional
    public InstructorApplication apply(Long userId, ApplyRequest req) {
        if (applicationRepo.existsByUserIdAndStatus(userId, ApplicationStatus.PENDING))
            throw BusinessException.of(P2ErrorCode.APPLICATION_PENDING);
        return applicationRepo.save(InstructorApplication.builder()
                .userId(userId).bio(req.bio()).career(req.career()).sampleVideoUrl(req.sampleVideoUrl())
                .build());
    }

    @Transactional(readOnly = true)
    public InstructorApplication getMyLatest(Long userId) {
        return applicationRepo.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<InstructorApplication> list(String statusParam) {
        if (statusParam == null || statusParam.isBlank()) return applicationRepo.findAll();
        return applicationRepo.findByStatusOrderByCreatedAtAsc(ApplicationStatus.valueOf(statusParam.toUpperCase()));
    }

    @Transactional
    public void approve(Long applicationId, Long adminId) {
        InstructorApplication app = findOrThrow(applicationId);
        app.approve(adminId);

        User user = userRepository.findById(app.getUserId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        // 1. role → INSTRUCTOR
        user.promoteToInstructor();

        // 2. instructors 테이블 레코드 생성 (없을 때만)
        if (!instructorRepository.existsByUserId(user.getId())) {
            instructorRepository.save(Instructor.create(user, app.getBio(), app.getCareer()));
        }

        auditLogService.record(adminId, "APPROVE_INSTRUCTOR", "APPLICATION", applicationId, null);
    }

    @Transactional
    public void reject(Long applicationId, Long adminId, String reason) {
        findOrThrow(applicationId).reject(adminId, reason);
        auditLogService.record(adminId, "REJECT_INSTRUCTOR", "APPLICATION", applicationId, reason);
    }

    private InstructorApplication findOrThrow(Long id) {
        return applicationRepo.findById(id).orElseThrow(() ->
                new BusinessException(HttpStatus.NOT_FOUND, "APPLICATION_NOT_FOUND", "신청을 찾을 수 없습니다."));
    }

    public record ApplyRequest(String bio, String career, String sampleVideoUrl) {}
}
