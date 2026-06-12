package com.hooppath.domain.notification.repository;

import com.hooppath.domain.notification.entity.NotificationChannel;
import com.hooppath.domain.notification.entity.NotificationSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationSubscriptionRepository extends JpaRepository<NotificationSubscription, Long> {
    Optional<NotificationSubscription> findByUserIdAndChannel(Long userId, NotificationChannel channel);
}
