package com.pm.chatservice.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Component
public class WebSocketUserHandshakeHandler extends DefaultHandshakeHandler {
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_ROLE_HEADER = "X-User-Role";

    @Override
    protected Principal determineUser(@NonNull ServerHttpRequest request,
                                      @NonNull WebSocketHandler wsHandler,
                                      @NonNull Map<String, Object> attributes) {
        String userIdHeader = request.getHeaders().getFirst(USER_ID_HEADER);
        if (!StringUtils.hasText(userIdHeader)) {
            return null;
        }

        long userId;
        try {
            userId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException ex) {
            return null;
        }

        String role = request.getHeaders().getFirst(USER_ROLE_HEADER);
        if (StringUtils.hasText(role)) {
            return new UsernamePasswordAuthenticationToken(
                    Long.toString(userId),
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );
        }

        return new UsernamePasswordAuthenticationToken(Long.toString(userId), null, List.of());
    }
}