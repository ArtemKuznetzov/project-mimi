package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;

public record MessageCreateDTO(
        @NotBlank String body,
        String clientId,
        Long replyMessageId
) {}
