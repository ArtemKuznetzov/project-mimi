package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record MessageResponseDTO(
        @NotNull Long id,
        @NotNull Long dialogId,
        @NotNull String body,
        @NotNull Instant createdAt,
        Boolean isDeleted,
        Boolean isEdited,
        MessageResponseDTO replyMessage,
        List<AttachmentResponseDTO> attachments,

        @NotBlank String userName,
        @NotNull Long userId,
        String userAvatarId,
        String clientId
) {}