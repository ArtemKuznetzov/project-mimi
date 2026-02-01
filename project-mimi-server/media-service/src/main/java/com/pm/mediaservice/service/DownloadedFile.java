package com.pm.mediaservice.service;

import io.minio.GetObjectResponse;
import lombok.Getter;

import java.io.IOException;
import java.io.InputStream;

@Getter
public class DownloadedFile implements AutoCloseable {

    private final GetObjectResponse response;
    private final long contentLength;
    private final String contentType;

    public DownloadedFile(GetObjectResponse response) {
        this.response = response;
        this.contentLength = parseContentLength(response);
        this.contentType = response.headers().get("Content-Type");
    }

    public InputStream getInputStream() {
        return response;
    }

    private static long parseContentLength(GetObjectResponse response) {
        String length = response.headers().get("Content-Length");
        if (length == null || length.isEmpty()) {
            return -1;
        }
        try {
            return Long.parseLong(length);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    @Override
    public void close() throws IOException {
        response.close();
    }
}