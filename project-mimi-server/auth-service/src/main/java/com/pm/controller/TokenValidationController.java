package com.pm.controller;

import com.pm.dto.TokenValidationResult;
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
    public ResponseEntity<TokenValidationResult> validate(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(validationService.validate(token));
    }
}