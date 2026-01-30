package com.pm.common.web.error;

import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(
        String code,
        String message,
        String path,
        int status,
        Instant timestamp,
        List<FieldErrorDetail> errors
) {
    public static ErrorResponse of(HttpStatus status, String code, String message, String path) {
        return new ErrorResponse(code, message, path, status.value(), Instant.now(), null);
    }

    public static ErrorResponse of(HttpStatus status,
                                   String code,
                                   String message,
                                   String path,
                                   List<FieldErrorDetail> errors) {
        return new ErrorResponse(code, message, path, status.value(), Instant.now(), errors);
    }
}