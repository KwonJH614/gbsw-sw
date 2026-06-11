package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.dto.SubscriptionResponse;
import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.entity.NotificationChannel;
import com.hooppath.domain.notification.entity.NotificationSubscription;
import com.hooppath.domain.notification.entity.NotificationType;
import com.hooppath.domain.notification.repository.NotificationSubscriptionRepository;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationSubscriptionService {

    private final NotificationSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final DiscordWebhookClient webhookClient;
    private final NotificationLogService logService;

    @Transactional(readOnly = true)
    public SubscriptionResponse get(Long userId) {
        return subscriptionRepository.findByUserIdAndChannel(userId, NotificationChannel.DISCORD)
                .map(SubscriptionResponse::from)
                .orElseGet(SubscriptionResponse::none);
    }

    @Transactional
    public SubscriptionResponse subscribe(Long userId, String webhookUrl) {
        webhookClient.validate(webhookUrl);
        NotificationSubscription subscription = subscriptionRepository
                .findByUserIdAndChannel(userId, NotificationChannel.DISCORD)
                .map(existing -> {
                    existing.updateWebhook(webhookUrl);
                    return existing;
                })
                .orElseGet(() -> NotificationSubscription.discord(findUser(userId), webhookUrl));
        return SubscriptionResponse.from(subscriptionRepository.save(subscription));
    }

    public void test(Long userId) {
        NotificationSubscription subscription = activeSubscription(userId);
        try {
            webhookClient.send(subscription.getWebhookUrl(), "HoopPath Discord 알림 연결 테스트가 완료되었습니다.");
            markTested(subscription.getId());
            logService.record(userId, NotificationType.WEBHOOK_TEST, DeliveryStatus.SUCCESS, null);
        } catch (Exception exception) {
            logService.record(userId, NotificationType.WEBHOOK_TEST, DeliveryStatus.FAILED,
                    exception.getClass().getSimpleName());
            throw new BusinessException(HttpStatus.BAD_GATEWAY, "WEBHOOK_SEND_FAILED",
                    "Discord 테스트 알림 전송에 실패했습니다.");
        }
    }

    @Transactional
    public void unsubscribe(Long userId) {
        subscriptionRepository.findByUserIdAndChannel(userId, NotificationChannel.DISCORD)
                .ifPresent(NotificationSubscription::deactivate);
    }

    @Transactional
    protected void markTested(Long subscriptionId) {
        subscriptionRepository.findById(subscriptionId).ifPresent(subscription -> {
            subscription.markTested();
            subscriptionRepository.save(subscription);
        });
    }

    private NotificationSubscription activeSubscription(Long userId) {
        return subscriptionRepository.findByUserIdAndChannel(userId, NotificationChannel.DISCORD)
                .filter(NotificationSubscription::isActive)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "SUBSCRIPTION_NOT_FOUND",
                        "활성화된 Discord 구독이 없습니다."));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND",
                        "사용자를 찾을 수 없습니다."));
    }
}
