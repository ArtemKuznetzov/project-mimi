package com.pm.apigateway.dto;

public record TokenValidationResultDTO(
        Long userId,
        String email,
        String role
) {}
