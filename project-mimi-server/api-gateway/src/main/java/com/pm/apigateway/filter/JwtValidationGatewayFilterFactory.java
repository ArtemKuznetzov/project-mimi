package com.pm.apigateway.filter;

import com.pm.apigateway.dto.TokenValidationResultDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

@Component
public class JwtValidationGatewayFilterFactory extends AbstractGatewayFilterFactory<Object> {
    private final WebClient webClient;

    public JwtValidationGatewayFilterFactory(WebClient.Builder webClientBuilder, @Value("${auth.service.url}") String authServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(authServiceUrl).build();
    }
    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String tokenValue = resolveToken(exchange);
            if (tokenValue == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String authHeader = "Bearer " + tokenValue;
            return webClient.get()
                    .uri("/validate")
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .bodyToMono(TokenValidationResultDTO.class)
                    .flatMap(result -> {
                        var mutatedRequest = exchange.getRequest()
                                .mutate()
                                .headers(headers -> {
                                    headers.set("X-User-Id", result.userId().toString());
                                    headers.set("X-User-Role", result.role());
                                })
                                .build();

                        return chain.filter(
                                exchange.mutate().request(mutatedRequest).build()
                        );
                    })
                    .onErrorResume(ex -> {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }

    private String resolveToken(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // For websocket
        // TODO refactor JWT for websokets - create short-lived tokens
        String tokenParam = exchange.getRequest().getQueryParams().getFirst("token");
        if (tokenParam == null || tokenParam.isBlank()) {
            return null;
        }

        if (tokenParam.startsWith("Bearer ")) {
            return tokenParam.substring(7);
        }

        return tokenParam;
    }
}
