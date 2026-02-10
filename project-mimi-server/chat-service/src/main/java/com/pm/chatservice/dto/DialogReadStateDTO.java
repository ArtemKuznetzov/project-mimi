package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record DialogReadStateDTO(
        @NotNull Long dialogId,
        @NotNull Long userId,
        Long lastReadMessageId,
        Instant lastReadAt,
        Long otherLastReadMessageId
) {}