package com.pm.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RefreshTokenCookieService {

    private static final String COOKIE_NAME = "refreshToken";
    private static final Duration MAX_AGE = Duration.ofDays(7);
    private static final String PATH = "/";
    private static final String SAME_SITE_STRICT = "Strict";

    private final boolean secure;

    public RefreshTokenCookieService(
            @Value("${cookie.secure:false}") boolean secure) {
        this.secure = secure;
    }

    public void add(HttpServletResponse response, String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token cannot be null or blank");
        }

        Cookie cookie = createCookie(token, MAX_AGE.getSeconds());
        response.addCookie(cookie);
    }

    public void remove(HttpServletResponse response) {
        Cookie cookie = createCookie("", 0);
        response.addCookie(cookie);
    }

    private Cookie createCookie(String value, long maxAge) {
        Cookie cookie = new Cookie(COOKIE_NAME, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setPath(PATH);
        cookie.setMaxAge((int) maxAge);
        cookie.setAttribute("SameSite", SAME_SITE_STRICT);
        return cookie;
    }
}