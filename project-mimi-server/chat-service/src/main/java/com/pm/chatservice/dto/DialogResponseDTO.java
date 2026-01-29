package com.pm.chatservice.dto;

import java.time.LocalDateTime;

public record DialogResponseDTO(
    Long id,
    Long userId,
    String userName,
    String userAvatarUrl,
    String lastMessageBody,
    LocalDateTime lastMessageDate
) {}
