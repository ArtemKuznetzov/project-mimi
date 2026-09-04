package com.pm.chatservice.repository;

import com.pm.chatservice.entity.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {
    List<MessageReaction> findByMessageId(Long messageId);
    List<MessageReaction> findByMessageIdIn(List<Long> messageIds);

    Boolean existsByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);

    void deleteByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);
}
