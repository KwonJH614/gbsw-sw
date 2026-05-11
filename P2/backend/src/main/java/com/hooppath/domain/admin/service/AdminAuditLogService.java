package com.hooppath.domain.admin.service;

import com.hooppath.domain.admin.entity.AdminAuditLog;
import com.hooppath.domain.admin.repository.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAuditLogService {

    private final AdminAuditLogRepository repo;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(Long adminId, String action, String targetType, Long targetId, String memo) {
        repo.save(AdminAuditLog.builder()
                .adminId(adminId).action(action)
                .targetType(targetType).targetId(targetId).memo(memo)
                .build());
    }

    @Transactional(readOnly = true)
    public List<AdminAuditLog> list() {
        return repo.findAllByOrderByCreatedAtDesc();
    }
}
