package com.pm.service;

import com.pm.dto.TokenValidationResultDTO;
import com.pm.common.web.exception.UnauthorizedException;
import com.pm.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenValidationService {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public TokenValidationResultDTO validate(String token) {
        try {
            jwtUtil.validateAccessToken(token);
        } catch (JwtException ex) {
            throw new UnauthorizedException("Invalid token");
        }

        Long tokenUserId = jwtUtil.getUserIdFromToken(token);
        if (tokenUserId == null) {
            throw new UnauthorizedException("Missing user id in token");
        }
        String role = jwtUtil.getRoleFromToken(token);

        var user = userService.findById(tokenUserId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return new TokenValidationResultDTO(
                user.getId(),
                user.getEmail(),
                role
        );
    }
}
