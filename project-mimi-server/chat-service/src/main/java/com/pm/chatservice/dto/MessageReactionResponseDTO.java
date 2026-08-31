package com.pm.chatservice.dto;

import java.util.List;

public record MessageReactionResponseDTO(
        Long messageId,
        List<ReactionGroup> reactions
) {
    public record ReactionGroup(
            String emoji,
            List<Long> userIds
    ) {}
}
