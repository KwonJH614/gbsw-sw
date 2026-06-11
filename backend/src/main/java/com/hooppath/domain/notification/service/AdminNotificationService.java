package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.dto.DeliveryLogResponse;
import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.repository.NotificationDeliveryLogRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminNotificationService {

    private final NotificationDeliveryLogRepository logRepository;

    @Transactional(readOnly = true)
    public Page<DeliveryLogResponse> getLogs(int page, int size, String status) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "sentAt"));
        if (status == null || status.isBlank()) {
            return logRepository.findAll(pageable).map(DeliveryLogResponse::from);
        }
        try {
            return logRepository.findByStatus(DeliveryStatus.valueOf(status.toUpperCase()), pageable)
                    .map(DeliveryLogResponse::from);
        } catch (IllegalArgumentException exception) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_STATUS", "알림 상태 값이 올바르지 않습니다.");
        }
    }
}
