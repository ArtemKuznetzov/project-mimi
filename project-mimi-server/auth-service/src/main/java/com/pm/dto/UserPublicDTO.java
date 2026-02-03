package com.pm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserPublicDTO(
        @NotNull Long id,
        @NotBlank String displayName,
        String avatarId
) {
}