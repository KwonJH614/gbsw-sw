package com.hooppath.domain.notification.repository;

import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.entity.NotificationDeliveryLog;
import com.hooppath.domain.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationDeliveryLogRepository extends JpaRepository<NotificationDeliveryLog, Long> {

    Page<NotificationDeliveryLog> findByStatus(DeliveryStatus status, Pageable pageable);

    boolean existsByUserIdAndNotificationTypeAndSentAtBetween(
            Long userId, NotificationType notificationType, LocalDateTime from, LocalDateTime to);

    @Query(value = """
            SELECT u.id AS userId,
                   u.nickname AS nickname,
                   ns.webhook_url AS webhookUrl,
                   COUNT(DISTINCT e.id) AS enrollmentCount,
                   MAX(p.updated_at) AS lastProgressAt
            FROM notification_subscriptions ns
            JOIN users u ON u.id = ns.user_id
            JOIN enrollments e ON e.user_id = u.id
            LEFT JOIN progresses p ON p.user_id = u.id
            WHERE ns.channel = 'DISCORD'
              AND ns.active = true
              AND u.is_suspended = false
            GROUP BY u.id, u.nickname, ns.webhook_url
            HAVING MAX(p.updated_at) IS NULL OR MAX(p.updated_at) < :inactiveBefore
            """, nativeQuery = true)
    List<LearningReminderTarget> findLearningReminderTargets(@Param("inactiveBefore") LocalDateTime inactiveBefore);
}
