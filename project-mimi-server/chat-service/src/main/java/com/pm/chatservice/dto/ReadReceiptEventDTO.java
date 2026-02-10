package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record ReadReceiptEventDTO(
        @NotNull Long dialogId,
        @NotNull Long userId,
        @NotNull Long lastReadMessageId,
        Instant readAt
) {}