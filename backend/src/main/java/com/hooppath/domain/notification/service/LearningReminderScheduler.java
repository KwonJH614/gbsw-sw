package com.hooppath.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.notification.schedule-enabled", havingValue = "true", matchIfMissing = true)
public class LearningReminderScheduler {

    private final LearningReminderService learningReminderService;

    @Scheduled(cron = "${app.notification.schedule-cron:0 0 9 * * *}", zone = "Asia/Seoul")
    public void run() {
        learningReminderService.run();
    }
}
