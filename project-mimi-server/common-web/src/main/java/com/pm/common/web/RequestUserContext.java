package com.pm.common.web;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.pm.common.web.exception.UnauthorizedException;

@Component
public class RequestUserContext {
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String AUTH_HEADER = "Authorization";

    public Long getCurrentUserId() {
        ServletRequestAttributes servletAttributes = getServletAttributes();
        String userIdHeader = servletAttributes.getRequest().getHeader(USER_ID_HEADER);
        if (userIdHeader == null || userIdHeader.isBlank()) {
            throw new UnauthorizedException("Missing X-User-Id header");
        }
        try {
            return Long.parseLong(userIdHeader);
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid X-User-Id header");
        }
    }

    public String getAuthorizationHeader() {
        ServletRequestAttributes servletAttributes = getServletAttributes();
        String authHeader = servletAttributes.getRequest().getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing or invalid Authorization header");
        }
        return authHeader;
    }

    private ServletRequestAttributes getServletAttributes() {
        var attributes = RequestContextHolder.getRequestAttributes();
        if (!(attributes instanceof ServletRequestAttributes servletAttributes)) {
            throw new UnauthorizedException("Missing request context");
        }
        return servletAttributes;
    }
}

