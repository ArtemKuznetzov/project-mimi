package com.pm.mediaservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(requiredProperties = {"objectName", "contentType", "size"})
public record MediaFileInfoDTO(
        String objectName,
        String originalName,
        String extension,
        String contentType,
        long size
) {
}
