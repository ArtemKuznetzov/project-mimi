package com.pm.chatservice.entity;

import com.pm.chatservice.entity.id.DialogUserStateId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "dialog_user_state")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DialogUserState {
    @EmbeddedId
    private DialogUserStateId id;

    @Column(name = "last_read_message_id")
    private Long lastReadMessageId;

    @Column(name = "last_read_at")
    private Instant lastReadAt;
}