package com.pm.chatservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MessageAttachment {
    @Column(name = "object_name", nullable = false)
    private String objectName;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "content_type")
    private String contentType;

    private String extension;

    private Integer size;

    @Column(name = "attachment_order", insertable = false, updatable = false)
    private Integer attachmentOrder;
}
