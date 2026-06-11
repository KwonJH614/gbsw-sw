package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.entity.NotificationDeliveryLog;
import com.hooppath.domain.notification.entity.NotificationType;
import com.hooppath.domain.notification.repository.NotificationDeliveryLogRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationLogService {

    private final NotificationDeliveryLogRepository logRepository;
    private final UserRepository userRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(Long userId, NotificationType type, DeliveryStatus status, String failureReason) {
        User user = userRepository.getReferenceById(userId);
        String safeReason = failureReason == null ? null : failureReason.substring(0, Math.min(500, failureReason.length()));
        logRepository.save(NotificationDeliveryLog.of(user, type, status, safeReason));
    }
}
