package com.hooppath.domain.notification.entity;

import com.hooppath.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_delivery_logs", indexes = {
        @Index(name = "idx_notification_delivery_sent_at", columnList = "sent_at"),
        @Index(name = "idx_notification_delivery_status_sent_at", columnList = "status, sent_at"),
        @Index(name = "idx_notification_delivery_dedup", columnList = "user_id, notification_type, sent_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationDeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryStatus status;

    @Column(length = 500)
    private String failureReason;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    public static NotificationDeliveryLog of(
            User user, NotificationType type, DeliveryStatus status, String failureReason) {
        NotificationDeliveryLog log = new NotificationDeliveryLog();
        log.user = user;
        log.notificationType = type;
        log.status = status;
        log.failureReason = failureReason;
        log.sentAt = LocalDateTime.now();
        return log;
    }
}
