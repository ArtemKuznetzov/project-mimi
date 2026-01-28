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
                .map(user -> generateTokenPair(user.getEmail(), user.getRole().name()));
    }

    public Optional<TokenPairDTO> refreshTokens(String refreshToken) {
        if (!jwtUtil.isValidToken(refreshToken)) {
            return Optional.empty();
        }

        String email = jwtUtil.getEmailFromToken(refreshToken);

        return userService.findByEmail(email)
                .map(user -> generateTokenPair(email, user.getRole().name()));
    }

    private TokenPairDTO generateTokenPair(String email, String role) {
        return new TokenPairDTO(
                jwtUtil.generateAccessToken(email, role),
                jwtUtil.generateRefreshToken(email, role)
        );
    }
}