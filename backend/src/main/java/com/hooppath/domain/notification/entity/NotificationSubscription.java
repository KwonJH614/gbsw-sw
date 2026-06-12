package com.hooppath.domain.notification.entity;

import com.hooppath.domain.user.entity.User;
import com.hooppath.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_subscriptions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "channel"}),
        indexes = @Index(name = "idx_notification_subscription_active_channel", columnList = "active, channel"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationSubscription extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    @Column(nullable = false, length = 500)
    private String webhookUrl;

    @Column(nullable = false)
    private boolean active;

    private LocalDateTime lastTestedAt;

    public static NotificationSubscription discord(User user, String webhookUrl) {
        NotificationSubscription subscription = new NotificationSubscription();
        subscription.user = user;
        subscription.channel = NotificationChannel.DISCORD;
        subscription.webhookUrl = webhookUrl;
        subscription.active = true;
        return subscription;
    }

    public void updateWebhook(String webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public void markTested() {
        this.lastTestedAt = LocalDateTime.now();
    }
}
