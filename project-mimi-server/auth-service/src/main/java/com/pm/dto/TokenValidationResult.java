package com.pm.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(requiredProperties = {"userId", "email", "role"})
public record TokenValidationResult(
        Long userId,
        String email,
        String role
) {}
