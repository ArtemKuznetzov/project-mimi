package com.pm.apigateway.dto;

public record TokenValidationResult(
        Long userId,
        String email,
        String role
) {}
