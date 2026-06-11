package com.hooppath.domain.notification.dto;

import com.hooppath.domain.notification.entity.NotificationSubscription;

import java.time.LocalDateTime;

public record SubscriptionResponse(boolean subscribed, String channel, LocalDateTime lastTestedAt) {
    public static SubscriptionResponse none() {
        return new SubscriptionResponse(false, "DISCORD", null);
    }

    public static SubscriptionResponse from(NotificationSubscription subscription) {
        return new SubscriptionResponse(subscription.isActive(), subscription.getChannel().name(), subscription.getLastTestedAt());
    }
}
