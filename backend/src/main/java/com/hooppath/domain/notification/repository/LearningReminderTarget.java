package com.hooppath.domain.notification.repository;

import java.time.LocalDateTime;

public interface LearningReminderTarget {
    Long getUserId();
    String getNickname();
    String getWebhookUrl();
    Long getEnrollmentCount();
    LocalDateTime getLastProgressAt();
}
