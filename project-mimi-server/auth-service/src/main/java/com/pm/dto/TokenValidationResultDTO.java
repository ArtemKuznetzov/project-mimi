package com.pm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TokenValidationResultDTO(
        @NotNull Long userId,
        @NotBlank String email,
        @NotBlank String role
) {}
