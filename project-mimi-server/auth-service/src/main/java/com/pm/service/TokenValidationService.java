package com.pm.service;

import com.pm.dto.TokenValidationResult;
import com.pm.exception.UnauthorizedException;
import com.pm.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenValidationService {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public TokenValidationResult validate(String token) {
        jwtUtil.validateAccessToken(token);

        String email = jwtUtil.getEmailFromToken(token);
        String role = jwtUtil.getRoleFromToken(token);

        var user = userService.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return new TokenValidationResult(
                user.getId(),
                user.getEmail(),
                role
        );
    }
}
