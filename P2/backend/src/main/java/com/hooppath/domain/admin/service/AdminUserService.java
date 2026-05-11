package com.hooppath.domain.admin.service;

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
public class AdminUserService {

    private final UserRepository userRepository;
    private final AdminAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<User> list(String q, String role, Boolean suspended) {
        return userRepository.findAll().stream()
                .filter(u -> q == null || u.getEmail().contains(q) || u.getNickname().contains(q))
                .filter(u -> role == null || u.getRole().name().equalsIgnoreCase(role))
                .filter(u -> suspended == null || u.isSuspended() == suspended)
                .toList();
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
