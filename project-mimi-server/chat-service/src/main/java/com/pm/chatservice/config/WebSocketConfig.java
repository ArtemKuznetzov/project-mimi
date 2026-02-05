package com.pm.chatservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.security.messaging.access.intercept.AuthorizationChannelInterceptor;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.security.messaging.context.SecurityContextChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import com.pm.chatservice.interceptor.WebSocketAuthInterceptor;

import java.util.Objects;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    private final WebSocketUserHandshakeHandler handshakeHandler;
    private final String[] allowedOrigins;

    public WebSocketConfig(@Value("${ws.allowed-origins}") String allowedOrigins,
                           WebSocketAuthInterceptor webSocketAuthInterceptor,
                           WebSocketUserHandshakeHandler handshakeHandler) {
        this.allowedOrigins = Objects.requireNonNull(allowedOrigins, "allowedOrigins").split(",");
        this.webSocketAuthInterceptor = Objects.requireNonNull(webSocketAuthInterceptor, "webSocketAuthInterceptor");
        this.handshakeHandler = Objects.requireNonNull(handshakeHandler, "handshakeHandler");
    }

    @Bean
    public SecurityContextChannelInterceptor securityContextChannelInterceptor() {
        return new SecurityContextChannelInterceptor();
    }

    @Bean
    public AuthorizationChannelInterceptor authorizationChannelInterceptor() {
        MessageMatcherDelegatingAuthorizationManager.Builder builder =
                MessageMatcherDelegatingAuthorizationManager.builder();
        builder.simpTypeMatchers(
                        SimpMessageType.CONNECT,
                        SimpMessageType.DISCONNECT,
                        SimpMessageType.HEARTBEAT,
                        SimpMessageType.UNSUBSCRIBE
                )
                .permitAll();
        builder.simpSubscribeDestMatchers("/topic/**", "/queue/**", "/user/**").authenticated();
        builder.simpDestMatchers("/app/**").authenticated();
        builder.anyMessage().denyAll();

        return new AuthorizationChannelInterceptor(builder.build());
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(Objects.requireNonNull(allowedOrigins, "allowedOrigins"))
                .setHandshakeHandler(handshakeHandler);
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(
                webSocketAuthInterceptor,
                securityContextChannelInterceptor(),
                authorizationChannelInterceptor()
        );
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
    }
}