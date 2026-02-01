package com.pm.controller;

import com.pm.dto.TokenValidationResultDTO;
import com.pm.common.web.exception.UnauthorizedException;
import com.pm.service.TokenValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/validate")
public class TokenValidationController {

    private final TokenValidationService validationService;

    @GetMapping
    public ResponseEntity<TokenValidationResultDTO> validate(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring("Bearer ".length());
        return ResponseEntity.ok(validationService.validate(token));
    }
}