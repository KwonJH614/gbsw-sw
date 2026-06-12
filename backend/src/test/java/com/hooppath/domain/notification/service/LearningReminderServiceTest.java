package com.hooppath.domain.notification.service;

import com.hooppath.domain.notification.dto.JobResultResponse;
import com.hooppath.domain.notification.entity.DeliveryStatus;
import com.hooppath.domain.notification.entity.NotificationType;
import com.hooppath.domain.notification.repository.LearningReminderTarget;
import com.hooppath.domain.notification.repository.NotificationDeliveryLogRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LearningReminderServiceTest {

    private NotificationDeliveryLogRepository repository;
    private DiscordWebhookClient webhookClient;
    private NotificationLogService logService;
    private LearningReminderService service;

    @BeforeEach
    void setUp() {
        repository = mock(NotificationDeliveryLogRepository.class);
        webhookClient = mock(DiscordWebhookClient.class);
        logService = mock(NotificationLogService.class);
        service = new LearningReminderService(repository, webhookClient, logService, new SimpleMeterRegistry());
        ReflectionTestUtils.setField(service, "inactiveDays", 7);
    }

    @Test
    void skipsUserAlreadyNotifiedToday() {
        LearningReminderTarget target = target(1L, "https://discord.com/api/webhooks/1/token");
        when(repository.findLearningReminderTargets(any())).thenReturn(List.of(target));
        when(repository.existsByUserIdAndNotificationTypeAndSentAtBetween(eq(1L), any(), any(), any()))
                .thenReturn(true);

        JobResultResponse result = service.run();

        assertThat(result).isEqualTo(new JobResultResponse(1, 0, 0, 1));
        verifyNoInteractions(webhookClient, logService);
    }

    @Test
    void recordsSuccessAndFailureWithoutStoppingBatch() {
        LearningReminderTarget successTarget = target(1L, "https://discord.com/api/webhooks/1/token");
        LearningReminderTarget failedTarget = target(2L, "https://discord.com/api/webhooks/2/token");
        when(repository.findLearningReminderTargets(any())).thenReturn(List.of(successTarget, failedTarget));
        when(repository.existsByUserIdAndNotificationTypeAndSentAtBetween(anyLong(), any(), any(), any()))
                .thenReturn(false);
        doThrow(new RuntimeException("timeout")).when(webhookClient)
                .send(eq("https://discord.com/api/webhooks/2/token"), anyString());

        JobResultResponse result = service.run();

        assertThat(result).isEqualTo(new JobResultResponse(2, 1, 1, 0));
        verify(logService).record(1L, NotificationType.LEARNING_REMINDER, DeliveryStatus.SUCCESS, null);
        verify(logService).record(2L, NotificationType.LEARNING_REMINDER, DeliveryStatus.FAILED, "RuntimeException");
    }

    private LearningReminderTarget target(Long userId, String webhookUrl) {
        LearningReminderTarget target = mock(LearningReminderTarget.class);
        when(target.getUserId()).thenReturn(userId);
        when(target.getNickname()).thenReturn("student-" + userId);
        when(target.getWebhookUrl()).thenReturn(webhookUrl);
        when(target.getEnrollmentCount()).thenReturn(1L);
        return target;
    }
}
