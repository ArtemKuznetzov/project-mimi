package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotNull;

public record ReadReceiptDTO(
        @NotNull Long lastReadMessageId
) {}