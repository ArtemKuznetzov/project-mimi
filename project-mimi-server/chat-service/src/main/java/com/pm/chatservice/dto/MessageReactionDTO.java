package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;

public record MessageReactionDTO(
        @NotBlank String emoji
) {
}
