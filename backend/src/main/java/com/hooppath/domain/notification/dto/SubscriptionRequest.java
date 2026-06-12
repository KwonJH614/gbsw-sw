package com.hooppath.domain.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubscriptionRequest(
        @NotBlank(message = "Discord Webhook URL을 입력해주세요.")
        @Size(max = 500, message = "Webhook URL은 500자 이하여야 합니다.")
        String webhookUrl
) {
}
