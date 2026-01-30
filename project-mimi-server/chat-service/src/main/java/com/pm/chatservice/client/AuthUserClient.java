package com.pm.chatservice.client;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.common.web.RequestUserContext;
import com.pm.common.web.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Objects;

@Service
public class AuthUserClient {
    private final RestClient restClient;
    private final RequestUserContext requestUserContext;

    public AuthUserClient(RestClient.Builder restClientBuilder,
                          @Value("${auth.service.url}") String authServiceUrl,
                          RequestUserContext requestUserContext) {
        this.restClient = restClientBuilder
                .baseUrl(Objects.requireNonNull(authServiceUrl, "authServiceUrl is null"))
                .build();
        this.requestUserContext = requestUserContext;
    }

    @Cacheable(cacheNames = "auth-users", key = "#userId", unless = "#result == null")
    public UserPublicDTO getUser(Long userId) {
        String authHeader = requestUserContext.getAuthorizationHeader();
        try {
            return restClient.get()
                    .uri("/users/{id}", userId)
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .body(UserPublicDTO.class);
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new UnauthorizedException("Invalid token");
        } catch (HttpClientErrorException.NotFound ex) {
            return null;
        }
    }
}