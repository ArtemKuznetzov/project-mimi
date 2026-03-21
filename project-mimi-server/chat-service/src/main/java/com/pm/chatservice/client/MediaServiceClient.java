package com.pm.chatservice.client;

import com.pm.chatservice.mediaclient.model.MediaFileInfoDTO;
import com.pm.common.web.RequestUserContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MediaServiceClient {
    private static final String USER_ID_HEADER = "X-User-Id";

    private final RestClient restClient;
    private final RequestUserContext requestUserContext;

    public MediaServiceClient(@Value("${media.service.url}") String mediaServiceUrl,
                              RequestUserContext requestUserContext) {
        this.restClient = RestClient.builder()
                .baseUrl(mediaServiceUrl)
                .build();
        this.requestUserContext = requestUserContext;
    }

    public List<MediaFileInfoDTO> uploadFiles(List<MultipartFile> files) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        for (MultipartFile file : files) {
            body.add("files", file.getResource());
        }
        return restClient.post()
                .uri("/files/upload-multi")
                .header(USER_ID_HEADER, requestUserContext.getCurrentUserId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }
}
