package com.hooppath.domain.notification.dto;

public record JobResultResponse(int targets, int success, int failed, int skipped) {
}
