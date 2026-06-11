package com.hooppath.domain.admin.service;

import com.hooppath.domain.admin.dto.AdminUserResponse;
import com.hooppath.domain.user.entity.Role;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import com.hooppath.global.exception.P2ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final AdminAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public Page<AdminUserResponse> list(String q, String role, Boolean suspended, int page, int size) {
        Specification<User> specification = (root, query, cb) -> cb.conjunction();
        if (q != null && !q.isBlank()) {
            String keyword = q.trim().toLowerCase();
            specification = specification.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("email")), "%" + keyword + "%"),
                    cb.like(cb.lower(root.get("nickname")), "%" + keyword + "%")));
        }
        if (role != null && !role.isBlank()) {
            try {
                Role parsedRole = Role.valueOf(role.toUpperCase());
                specification = specification.and((root, query, cb) -> cb.equal(root.get("role"), parsedRole));
            } catch (IllegalArgumentException exception) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "사용자 역할 값이 올바르지 않습니다.");
            }
        }
        if (suspended != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("isSuspended"), suspended));
        }
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return userRepository.findAll(specification, pageable).map(AdminUserResponse::from);
    }

    @Transactional
    public void changeRole(Long targetId, String newRole, Long adminId) {
        if (targetId.equals(adminId)) throw BusinessException.of(P2ErrorCode.SELF_DEMOTION);
        User user = userRepository.findById(targetId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));
        user.changeRole(newRole);
        auditLogService.record(adminId, "CHANGE_ROLE", "USER", targetId, "to " + newRole);
    }

    @Transactional
    public void setSuspended(Long targetId, boolean suspended, Long adminId) {
        User user = userRepository.findById(targetId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));
        user.setSuspended(suspended);
        auditLogService.record(adminId, suspended ? "SUSPEND_USER" : "UNSUSPEND_USER", "USER", targetId, null);
    }
}
