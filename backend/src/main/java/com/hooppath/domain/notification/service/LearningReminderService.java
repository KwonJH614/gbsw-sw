package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.dto.JobResultResponse;
import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.entity.NotificationType;
import com.hooppath.domain.notification.repository.LearningReminderTarget;
import com.hooppath.domain.notification.repository.NotificationDeliveryLogRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class LearningReminderService {

    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    private final NotificationDeliveryLogRepository logRepository;
    private final DiscordWebhookClient webhookClient;
    private final NotificationLogService logService;
    private final MeterRegistry meterRegistry;

    @Value("${app.notification.inactive-days:7}")
    private int inactiveDays;

    public JobResultResponse run() {
        long startedAt = System.nanoTime();
        LocalDateTime inactiveBefore = LocalDateTime.now(SEOUL).minusDays(inactiveDays);
        List<LearningReminderTarget> targets = logRepository.findLearningReminderTargets(inactiveBefore);
        int success = 0;
        int failed = 0;
        int skipped = 0;

        for (LearningReminderTarget target : targets) {
            if (sentToday(target.getUserId())) {
                skipped++;
                continue;
            }
            try {
                webhookClient.send(target.getWebhookUrl(), buildMessage(target));
                logService.record(target.getUserId(), NotificationType.LEARNING_REMINDER, DeliveryStatus.SUCCESS, null);
                success++;
            } catch (Exception exception) {
                logService.record(target.getUserId(), NotificationType.LEARNING_REMINDER,
                        DeliveryStatus.FAILED, exception.getClass().getSimpleName());
                failed++;
            }
        }

        JobResultResponse result = new JobResultResponse(targets.size(), success, failed, skipped);
        meterRegistry.counter("hooppath.notification.delivery", "status", "success").increment(success);
        meterRegistry.counter("hooppath.notification.delivery", "status", "failed").increment(failed);
        meterRegistry.timer("hooppath.notification.job.duration", "type", "learning-reminder")
                .record(System.nanoTime() - startedAt, TimeUnit.NANOSECONDS);
        log.info("notification_job type=learning-reminder targets={} success={} failed={} skipped={}",
                result.targets(), result.success(), result.failed(), result.skipped());
        return result;
    }

    private boolean sentToday(Long userId) {
        LocalDate today = LocalDate.now(SEOUL);
        return logRepository.existsByUserIdAndNotificationTypeAndSentAtBetween(
                userId,
                NotificationType.LEARNING_REMINDER,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay());
    }

    private String buildMessage(LearningReminderTarget target) {
        return "%s님, HoopPath에서 수강 중인 %d개 강의가 기다리고 있습니다. 오늘 다시 학습을 이어가 보세요!"
                .formatted(target.getNickname(), target.getEnrollmentCount());
    }
}
