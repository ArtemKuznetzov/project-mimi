package com.pm.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(requiredProperties = {"accessToken"})
public record LoginResponseDTO(
        String accessToken
) {
}
