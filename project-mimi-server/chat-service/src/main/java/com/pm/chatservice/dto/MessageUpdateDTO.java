package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotBlank;

public record MessageUpdateDTO(
        @NotBlank String body
) {}
