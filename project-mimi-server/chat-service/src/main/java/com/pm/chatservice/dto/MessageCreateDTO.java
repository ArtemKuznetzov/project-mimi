package com.pm.chatservice.dto;

import jakarta.validation.constraints.NotNull;

public record MessageCreateDTO(
        @NotNull Long userId,
        @NotNull String body
) {}