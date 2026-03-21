package com.pm.chatservice.dto;

public record AttachmentResponseDTO(
        String objectName,
        String fileName,
        String contentType,
        String extension,
        Integer size
) {}