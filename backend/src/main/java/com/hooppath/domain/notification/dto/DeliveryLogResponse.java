package com.hooppath.domain.notification.dto;

import com.hooppath.domain.notification.entity.NotificationDeliveryLog;

import java.time.LocalDateTime;

public record DeliveryLogResponse(
        Long id,
        Long userId,
        String nickname,
        String notificationType,
        String status,
        String failureReason,
        LocalDateTime sentAt
) {
    public static DeliveryLogResponse from(NotificationDeliveryLog log) {
        return new DeliveryLogResponse(
                log.getId(),
                log.getUser().getId(),
                log.getUser().getNickname(),
                log.getNotificationType().name(),
                log.getStatus().name(),
                log.getFailureReason(),
                log.getSentAt());
    }
}
