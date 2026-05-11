package com.hooppath.domain.admin.repository;

import com.hooppath.domain.admin.entity.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {
    List<AdminAuditLog> findAllByOrderByCreatedAtDesc();
}
