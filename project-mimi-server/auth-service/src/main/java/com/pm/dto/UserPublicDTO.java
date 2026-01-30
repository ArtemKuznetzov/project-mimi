package com.pm.dto;

public record UserPublicDTO(
        Long id,
        String displayName,
        String avatarUrl
) {
}