package com.pm.controller;

import com.pm.config.RefreshTokenCookieService;
import com.pm.dto.LoginRequestDTO;
import com.pm.dto.LoginResponseDTO;
import com.pm.dto.TokenPairDTO;
import com.pm.exception.UnauthorizedException;
import com.pm.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenCookieService cookieService;

    @Operation(summary = "Generate token on user login")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletResponse response
    ) {
        TokenPairDTO tokens = authService.authenticate(dto)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        return createSuccessResponse(tokens, response);
    }

    @Operation(summary = "Refresh access token")
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Refresh token is missing");
        }

        TokenPairDTO tokens = authService.refreshTokens(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        return createSuccessResponse(tokens, response);
    }

    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieService.remove(response);
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<LoginResponseDTO> createSuccessResponse(
            TokenPairDTO tokens,
            HttpServletResponse response
    ) {
        cookieService.add(response, tokens.refreshToken());
        return ResponseEntity.ok(new LoginResponseDTO(tokens.accessToken()));
    }
}