package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.entity.NotificationChannel;
import com.hooppath.domain.notification.entity.NotificationSubscription;
import com.hooppath.domain.notification.repository.NotificationSubscriptionRepository;
import com.hooppath.domain.user.entity.Role;
import com.hooppath.domain.user.entity.User;
import com.hooppath.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDiscordWebhookInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final NotificationSubscriptionRepository subscriptionRepository;
    private final DiscordWebhookClient webhookClient;

    @Value("${app.notification.demo-webhook-url:}")
    private String demoWebhookUrl;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(demoWebhookUrl)) {
            return;
        }

        try {
            webhookClient.validate(demoWebhookUrl);
        } catch (RuntimeException exception) {
            log.warn("Discord demo webhook URL is configured but invalid. Skipping demo subscription setup.");
            return;
        }

        userRepository.findFirstByRoleOrderByIdAsc(Role.STUDENT)
                .ifPresentOrElse(this::upsertDemoSubscription,
                        () -> log.warn("Discord demo webhook URL is configured but no STUDENT user exists."));
    }

    private void upsertDemoSubscription(User student) {
        NotificationSubscription subscription = subscriptionRepository
                .findByUserIdAndChannel(student.getId(), NotificationChannel.DISCORD)
                .map(existing -> {
                    existing.updateWebhook(demoWebhookUrl);
                    return existing;
                })
                .orElseGet(() -> NotificationSubscription.discord(student, demoWebhookUrl));

        subscriptionRepository.save(subscription);
        log.info("Configured Discord demo webhook subscription for student user_id={}", student.getId());
    }
}
