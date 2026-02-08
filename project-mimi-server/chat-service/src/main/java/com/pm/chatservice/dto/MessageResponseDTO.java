package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record MessageResponseDTO(
        @NotNull Long id,
        @NotNull Long dialogId,
        @NotNull String body,
        @NotNull Boolean isEdited,
        @NotNull Instant createdAt,

        @NotBlank String userName,
        @NotNull Long userId,
        String userAvatarId,
        String clientId
) {}