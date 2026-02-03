package com.pm.mediaservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record MediaFileInfoDTO(
        @NotBlank String objectName,
        String originalName,
        String extension,
        @NotBlank String contentType,
        @PositiveOrZero long size
) {
}
