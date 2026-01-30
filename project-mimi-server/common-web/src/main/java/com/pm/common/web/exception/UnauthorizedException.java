package com.pm.common.web.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApiException {
    private static final String CODE = "UNAUTHORIZED";

    public UnauthorizedException(String message) {
        super(HttpStatus.UNAUTHORIZED, CODE, message);
    }
}

