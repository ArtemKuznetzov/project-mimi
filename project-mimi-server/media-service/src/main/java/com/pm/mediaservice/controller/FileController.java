package com.pm.mediaservice.controller;

import com.pm.common.web.exception.ApiException;
import com.pm.mediaservice.dto.MediaFileInfoDTO;
import com.pm.mediaservice.service.DownloadedFile;
import com.pm.mediaservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.nio.charset.StandardCharsets;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@Tag(name = "Files", description = "Upload, download and manage files")
public class FileController {
    private final FileStorageService fileStorageService;

    @Operation(
            summary = "Upload file",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = UploadFileRequest.class)
                    )
            )
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaFileInfoDTO> uploadFile(@RequestPart("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "File is empty.");
        }

        MediaFileInfoDTO fileInfo = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(fileInfo);
    }

    @GetMapping("/download/{objectName}")
    public ResponseEntity<StreamingResponseBody> downloadFile(@PathVariable String objectName) {
        return buildFileResponse(objectName, true);
    }

    @GetMapping("/view/{objectName}")
    public ResponseEntity<StreamingResponseBody> viewFile(@PathVariable String objectName) {
        return buildFileResponse(objectName, false);
    }

    @GetMapping("/metadata/{objectName}")
    public ResponseEntity<MediaFileInfoDTO> getMetadata(@PathVariable String objectName) {
        return ResponseEntity.ok(fileStorageService.getFileInfo(objectName));
    }

    @DeleteMapping("/{objectName}")
    public ResponseEntity<Void> deleteFile(@PathVariable String objectName) {
        fileStorageService.deleteFile(objectName);
        return ResponseEntity.noContent().build();
    }

    public static class UploadFileRequest {
        @Schema(type = "string", format = "binary")
        public MultipartFile file;
    }

    private ResponseEntity<StreamingResponseBody> buildFileResponse(String objectName, boolean download) {
        MediaFileInfoDTO fileInfo = fileStorageService.getFileInfo(objectName);
        DownloadedFile file = fileStorageService.downloadFile(objectName);
        StreamingResponseBody body = outputStream -> {
            try (file) {
                file.getInputStream().transferTo(outputStream);
            }
        };

        String filename = fileInfo.originalName() == null || fileInfo.originalName().isBlank()
                ? objectName
                : fileInfo.originalName();
        ContentDisposition contentDisposition = ContentDisposition.builder(download ? "attachment" : "inline")
                .filename(filename, StandardCharsets.UTF_8)
                .build();

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString());
        if (fileInfo.size() > 0) {
            responseBuilder.header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileInfo.size()));
        } else if (file.getContentLength() > 0) {
            responseBuilder.header(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.getContentLength()));
        }
        String contentType = fileInfo.contentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = file.getContentType();
        }
        if (contentType != null && !contentType.isBlank()) {
            responseBuilder.contentType(MediaType.parseMediaType(contentType));
        } else {
            responseBuilder.contentType(MediaType.APPLICATION_OCTET_STREAM);
        }
        return responseBuilder.body(body);
    }
}