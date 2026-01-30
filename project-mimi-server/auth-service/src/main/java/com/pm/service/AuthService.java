package com.pm.service;

import com.pm.dto.LoginRequestDTO;
import com.pm.dto.TokenPairDTO;
import com.pm.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Optional<TokenPairDTO> authenticate(LoginRequestDTO dto) {
//        System.out.println(passwordEncoder.encode("mifamifa"));
        return userService.findByEmail(dto.email())
                .filter(user -> passwordEncoder.matches(dto.password(), user.getPassword()))
                .map(user -> generateTokenPair(user.getId(), user.getRole().name()));
    }

    public Optional<TokenPairDTO> refreshTokens(String refreshToken) {
        if (!jwtUtil.isRefreshToken(refreshToken)) {
            return Optional.empty();
        }

        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        if (userId == null) {
            return Optional.empty();
        }

        return userService.findById(userId)
                .map(user -> generateTokenPair(user.getId(), user.getRole().name()));
    }

    private TokenPairDTO generateTokenPair(Long userId, String role) {
        return new TokenPairDTO(
                jwtUtil.generateAccessToken(userId, role),
                jwtUtil.generateRefreshToken(userId, role)
        );
    }
}