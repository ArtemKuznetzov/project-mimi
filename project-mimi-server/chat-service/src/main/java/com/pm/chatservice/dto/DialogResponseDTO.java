package com.pm.chatservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(requiredProperties = {"id", "userId", "userName"})
public record DialogResponseDTO(
    Long id,
    Long userId,
    String userName,
    String userAvatarUrl,
    String lastMessageBody,
    LocalDateTime lastMessageDate
) {}
