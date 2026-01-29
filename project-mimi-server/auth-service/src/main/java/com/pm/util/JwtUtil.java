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
    private static final String TOKEN_TYPE_CLAIM = "token_type";
    private static final String TOKEN_TYPE_ACCESS = "access";
    private static final String TOKEN_TYPE_REFRESH = "refresh";

    private static final Duration ACCESS_TOKEN_EXPIRATION = Duration.ofHours(10);
    private static final Duration REFRESH_TOKEN_EXPIRATION = Duration.ofDays(7);

    private final SecretKey secretKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String email, String role) {
        return generateToken(email, role, TOKEN_TYPE_ACCESS, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(String email, String role) {
        return generateToken(email, role, TOKEN_TYPE_REFRESH, REFRESH_TOKEN_EXPIRATION);
    }

    private String generateToken(String email, String role, String tokenType, Duration expiration) {
        Instant now = Instant.now();
        Instant expirationTime = now.plus(expiration);

        return Jwts.builder()
                .subject(email)
                .claim(ROLE_CLAIM, role)
                .claim(TOKEN_TYPE_CLAIM, tokenType)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public void validateToken(String token) {
        parseSignedClaims(token);
    }

    public void validateAccessToken(String token) {
        ensureTokenType(token, TOKEN_TYPE_ACCESS);
    }

    public void validateRefreshToken(String token) {
        ensureTokenType(token, TOKEN_TYPE_REFRESH);
    }

    public boolean isValidToken(String token) {
        try {
            parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean isAccessToken(String token) {
        try {
            ensureTokenType(token, TOKEN_TYPE_ACCESS);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            ensureTokenType(token, TOKEN_TYPE_REFRESH);
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

    private void ensureTokenType(String token, String expectedType) {
        Claims claims = parseSignedClaims(token);
        String type = claims.get(TOKEN_TYPE_CLAIM, String.class);
        if (!expectedType.equals(type)) {
            throw new JwtException("Invalid token type");
        }
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