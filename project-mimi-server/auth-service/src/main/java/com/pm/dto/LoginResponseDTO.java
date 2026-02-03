package com.pm.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginResponseDTO(
        @NotBlank String accessToken
) {
}
