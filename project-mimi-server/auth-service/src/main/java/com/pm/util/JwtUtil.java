package com.pm.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String ROLE_CLAIM = "role";

    private static final Duration ACCESS_TOKEN_EXPIRATION = Duration.ofHours(10);
    private static final Duration REFRESH_TOKEN_EXPIRATION = Duration.ofDays(7);

    private final SecretKey secretKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String email, String role) {
        return generateToken(email, role, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(String email, String role) {
        return generateToken(email, role, REFRESH_TOKEN_EXPIRATION);
    }

    private String generateToken(String email, String role, Duration expiration) {
        Instant now = Instant.now();
        Instant expirationTime = now.plus(expiration);

        return Jwts.builder()
                .subject(email)
                .claim(ROLE_CLAIM, role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public void validateToken(String token) {
        parseSignedClaims(token);
    }

    public boolean isValidToken(String token) {
        try {
            parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return parseSignedClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = parseSignedClaims(token);
        return claims.get(ROLE_CLAIM, String.class);
    }

    private Claims parseSignedClaims(String token) {
        try {
            Jws<Claims> jwsClaims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return jwsClaims.getPayload();
        } catch (JwtException e) {
            throw new JwtException("Invalid JWT: " + e.getMessage(), e);
        }
    }
}