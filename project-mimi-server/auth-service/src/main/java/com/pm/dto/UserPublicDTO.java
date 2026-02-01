package com.pm.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(requiredProperties = {"id", "displayName"})
public record UserPublicDTO(
        Long id,
        String displayName,
        String avatarId
) {
}