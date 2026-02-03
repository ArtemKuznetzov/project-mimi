package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record DialogResponseDTO(
    @NotNull Long id,
    @NotNull Long userId,
    @NotBlank String userName,
    String userAvatarId,
    String lastMessageBody,
    Instant lastMessageDate
) {}
