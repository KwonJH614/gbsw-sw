package com.hooppath.domain.notification.service;

import com.hooppath.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DiscordWebhookClient {

    private static final Set<String> ALLOWED_HOSTS = Set.of("discord.com", "discordapp.com");
    private final RestClient restClient;

    public void validate(String webhookUrl) {
        try {
            URI uri = URI.create(webhookUrl);
            boolean validHost = uri.getHost() != null
                    && ALLOWED_HOSTS.stream().anyMatch(host ->
                    uri.getHost().equals(host) || uri.getHost().endsWith("." + host));
            boolean validPath = uri.getPath() != null && uri.getPath().startsWith("/api/webhooks/");
            if (!"https".equalsIgnoreCase(uri.getScheme()) || !validHost || !validPath) {
                throw invalidUrl();
            }
        } catch (IllegalArgumentException exception) {
            throw invalidUrl();
        }
    }

    public void send(String webhookUrl, String content) {
        validate(webhookUrl);
        restClient.post()
                .uri(webhookUrl)
                .body(Map.of("content", content))
                .retrieve()
                .toBodilessEntity();
    }

    private BusinessException invalidUrl() {
        return new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_WEBHOOK_URL",
                "유효한 Discord Webhook URL을 입력해주세요.");
    }
}
