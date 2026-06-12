package com.hooppath.domain.notification.service;

import com.hooppath.global.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DiscordWebhookClientTest {

    private final DiscordWebhookClient client = new DiscordWebhookClient(RestClient.create());

    @Test
    void acceptsDiscordHttpsWebhookUrl() {
        assertThatCode(() -> client.validate("https://discord.com/api/webhooks/123/token"))
                .doesNotThrowAnyException();
    }

    @Test
    void rejectsNonDiscordOrHttpWebhookUrl() {
        assertThatThrownBy(() -> client.validate("https://example.com/api/webhooks/123/token"))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> client.validate("http://discord.com/api/webhooks/123/token"))
                .isInstanceOf(BusinessException.class);
    }
}
