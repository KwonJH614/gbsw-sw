package com.hooppath.domain.admin.controller;

import com.hooppath.domain.admin.entity.AdminAuditLog;
import com.hooppath.domain.admin.service.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminAuditLogController {

    private final AdminAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        List<Map<String, Object>> data = auditLogService.list().stream()
                .map(log -> Map.<String, Object>of(
                        "id", log.getId(), "adminId", log.getAdminId(),
                        "action", log.getAction(), "targetType", log.getTargetType(),
                        "targetId", log.getTargetId(),
                        "memo", log.getMemo() != null ? log.getMemo() : "",
                        "createdAt", log.getCreatedAt().toString()))
                .toList();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}
