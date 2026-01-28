package com.pm.dto;

public record TokenValidationResult(
        Long userId,
        String email,
        String role
) {}
