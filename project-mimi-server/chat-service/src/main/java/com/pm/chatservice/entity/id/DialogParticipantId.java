package com.pm.chatservice.entity.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DialogParticipantId implements Serializable {
    @Column(name = "dialog_id")
    private Long dialogId;

    @Column(name = "user_id")
    private Long userId;
}