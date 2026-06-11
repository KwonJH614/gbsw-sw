package com.hooppath.domain.notification.controller;

import com.hooppath.domain.notification.dto.DeliveryLogResponse;
import com.hooppath.domain.notification.dto.JobResultResponse;
import com.hooppath.domain.notification.service.AdminNotificationService;
import com.hooppath.domain.notification.service.LearningReminderService;
import com.hooppath.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final AdminNotificationService adminNotificationService;
    private final LearningReminderService learningReminderService;

    @GetMapping("/notification-logs")
    public ResponseEntity<ApiResponse<Page<DeliveryLogResponse>>> logs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(adminNotificationService.getLogs(page, size, status)));
    }

    @PostMapping("/notification-jobs/learning-reminder")
    public ResponseEntity<ApiResponse<JobResultResponse>> runLearningReminder() {
        return ResponseEntity.ok(ApiResponse.ok(learningReminderService.run()));
    }
}
