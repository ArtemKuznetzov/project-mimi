package com.pm.chatservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "message_reactions", uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "user_id", "emoji"}))
public class MessageReaction {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Message message;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "emoji", nullable = false)
    private String emoji;

    @Column(name = "created_at")
    private Instant createdAt;
}
