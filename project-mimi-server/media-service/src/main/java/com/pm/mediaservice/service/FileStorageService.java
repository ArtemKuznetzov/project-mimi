package com.pm.mediaservice.service;

import com.pm.common.web.exception.ApiException;
import com.pm.mediaservice.dto.MediaFileInfoDTO;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.errors.ErrorResponseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLConnection;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {
    private static final Pattern SAFE_OBJECT_NAME = Pattern.compile("^[a-zA-Z0-9._-]+$");
    private static final int BUCKET_INIT_MAX_ATTEMPTS = 5;
    private static final long BUCKET_INIT_DELAY_MS = 2000;
    private static final String DEFAULT_FILENAME = "file";
    private static final String META_ORIGINAL_FILENAME = "original-filename";
    private static final String META_EXTENSION = "extension";

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    public void initializeBucket() {
        Exception lastException = null;
        for (int attempt = 0; attempt < BUCKET_INIT_MAX_ATTEMPTS; attempt++) {
            try {
                boolean found = minioClient.bucketExists(
                        BucketExistsArgs.builder().bucket(bucketName).build()
                );
                if (!found) {
                    minioClient.makeBucket(
                            MakeBucketArgs.builder().bucket(bucketName).build()
                    );
                    log.info("Bucket '{}' created successfully", bucketName);
                } else {
                    log.info("Bucket '{}' already exists", bucketName);
                }
                return;
            } catch (Exception e) {
                lastException = e;
                log.warn("Error initializing bucket (attempt {}/{}): {}", attempt + 1, BUCKET_INIT_MAX_ATTEMPTS, e.getMessage());
                if (attempt < BUCKET_INIT_MAX_ATTEMPTS - 1) {
                    try {
                        Thread.sleep(BUCKET_INIT_DELAY_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "BUCKET_INIT_FAILED",
                                "Storage is temporarily unavailable. Please try again later.", ie);
                    }
                }
            }
        }
        log.error("Failed to initialize bucket after {} attempts", BUCKET_INIT_MAX_ATTEMPTS, lastException);
        throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "BUCKET_INIT_FAILED",
                "Storage is temporarily unavailable. Please try again later.", lastException);
    }

    private void validateObjectName(String objectName) {
        if (objectName == null || objectName.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_OBJECT_NAME", "Invalid file reference.");
        }
        if (!SAFE_OBJECT_NAME.matcher(objectName).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_OBJECT_NAME", "Invalid file reference.");
        }
    }

    public MediaFileInfoDTO uploadFile(MultipartFile file) {
        String originalName = sanitizeFilename(file.getOriginalFilename());
        String extension = normalizeExtension(extractExtension(originalName));
        String objectName = UUID.randomUUID().toString();
        validateObjectName(objectName);
        String contentType = resolveContentType(file, originalName);
        Map<String, String> userMetadata = buildUserMetadata(originalName, extension);
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(contentType)
                            .userMetadata(userMetadata)
                            .build()
            );
            log.info("File '{}' uploaded successfully to bucket '{}'", objectName, bucketName);
            return new MediaFileInfoDTO(
                    objectName,
                    originalName,
                    extension,
                    contentType,
                    file.getSize()
            );
        } catch (Exception e) {
            log.error("Error uploading file '{}': {}", objectName, e.getMessage(), e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED",
                    "File could not be uploaded. Please try again later.", e);
        }
    }

    public DownloadedFile downloadFile(String objectName) {
        validateObjectName(objectName);
        try {
            GetObjectResponse response = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            return new DownloadedFile(response);
        } catch (ErrorResponseException e) {
            if ("NoSuchKey".equals(e.errorResponse().code())) {
                throw new ApiException(HttpStatus.NOT_FOUND, "FILE_NOT_FOUND", "File not found.");
            }
            log.error("MinIO error downloading file '{}': {}", objectName, e.getMessage());
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "DOWNLOAD_FAILED",
                    "File could not be loaded. Please try again later.", e);
        } catch (Exception e) {
            log.error("Error downloading file '{}': {}", objectName, e.getMessage(), e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "DOWNLOAD_FAILED",
                    "File could not be loaded. Please try again later.", e);
        }
    }

    public MediaFileInfoDTO getFileInfo(String objectName) {
        validateObjectName(objectName);
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            String originalName = resolveOriginalName(stat.userMetadata(), objectName);
            String extension = resolveExtension(stat.userMetadata(), originalName, objectName);
            String contentType = stat.contentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }
            return new MediaFileInfoDTO(
                    objectName,
                    originalName,
                    extension,
                    contentType,
                    stat.size()
            );
        } catch (ErrorResponseException e) {
            if ("NoSuchKey".equals(e.errorResponse().code())) {
                throw new ApiException(HttpStatus.NOT_FOUND, "FILE_NOT_FOUND", "File not found.");
            }
            log.error("MinIO error fetching file info '{}': {}", objectName, e.getMessage());
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "INFO_FAILED",
                    "File metadata could not be loaded. Please try again later.", e);
        } catch (Exception e) {
            log.error("Error fetching file info '{}': {}", objectName, e.getMessage(), e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "INFO_FAILED",
                    "File metadata could not be loaded. Please try again later.", e);
        }
    }

    public void deleteFile(String objectName) {
        validateObjectName(objectName);
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            log.info("File '{}' deleted successfully from bucket '{}'", objectName, bucketName);
        } catch (ErrorResponseException e) {
            if ("NoSuchKey".equals(e.errorResponse().code())) {
                throw new ApiException(HttpStatus.NOT_FOUND, "FILE_NOT_FOUND", "File not found.");
            }
            log.error("MinIO error deleting file '{}': {}", objectName, e.getMessage());
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "DELETE_FAILED",
                    "File could not be deleted. Please try again later.", e);
        } catch (Exception e) {
            log.error("Error deleting file '{}': {}", objectName, e.getMessage(), e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "DELETE_FAILED",
                    "File could not be deleted. Please try again later.", e);
        }
    }

    private static String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return DEFAULT_FILENAME;
        }
        String sanitized = originalFilename.replace("\\", "_").replace("/", "_");
        sanitized = sanitized.replace("\"", "_");
        sanitized = sanitized.replaceAll("[\\r\\n\\t]", " ").trim();
        return sanitized.isBlank() ? DEFAULT_FILENAME : sanitized;
    }

    private static String extractExtension(String filename) {
        if (filename == null || filename.isBlank()) {
            return "";
        }
        int lastDot = filename.lastIndexOf('.');
        if (lastDot <= 0 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1);
    }

    private static String normalizeExtension(String extension) {
        if (extension == null) {
            return "";
        }
        String normalized = extension.startsWith(".") ? extension.substring(1) : extension;
        normalized = normalized.trim();
        if (normalized.isEmpty()) {
            return "";
        }
        return normalized.toLowerCase(Locale.ROOT);
    }

    private static String resolveContentType(MultipartFile file, String originalName) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = URLConnection.guessContentTypeFromName(originalName);
        }
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
        return contentType;
    }

    private static Map<String, String> buildUserMetadata(String originalName, String extension) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put(META_ORIGINAL_FILENAME, originalName);
        if (extension != null && !extension.isBlank()) {
            metadata.put(META_EXTENSION, extension);
        }
        return metadata;
    }

    private static String resolveOriginalName(Map<String, String> metadata, String objectName) {
        if (metadata == null) {
            return objectName;
        }
        String originalName = metadata.get(META_ORIGINAL_FILENAME);
        if (originalName == null || originalName.isBlank()) {
            return objectName;
        }
        return sanitizeFilename(originalName);
    }

    private static String resolveExtension(Map<String, String> metadata, String originalName, String objectName) {
        String extension = null;
        if (metadata != null) {
            extension = metadata.get(META_EXTENSION);
        }
        extension = normalizeExtension(extension);
        if (extension.isBlank()) {
            extension = normalizeExtension(extractExtension(originalName));
        }
        if (extension.isBlank()) {
            extension = normalizeExtension(extractExtension(objectName));
        }
        return extension;
    }
}