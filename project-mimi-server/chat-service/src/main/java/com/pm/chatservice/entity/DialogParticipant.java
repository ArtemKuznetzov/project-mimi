package com.pm.chatservice.entity;

import com.pm.chatservice.entity.id.DialogParticipantId;
import com.pm.chatservice.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dialog_participants")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DialogParticipant {
    @EmbeddedId
    private DialogParticipantId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("dialogId")
    @JoinColumn(name = "dialog_id", nullable = false)
    private Dialog dialog;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}