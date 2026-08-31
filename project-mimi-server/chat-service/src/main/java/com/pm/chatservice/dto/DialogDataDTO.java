package com.pm.chatservice.dto;

public record DialogDataDTO(
    Long dialogId,
    Number participantsCount,
    Number otherUserId,  // nullable for groups
    String dialogTitle,  // nullable, only for groups
    String dialogAvatarUrl,  // nullable, only for groups
    Long lastMessageId,
    String lastMessageBody,
    java.time.Instant lastMessageDate,
    Long lastMessageUserId
) {
    public Long getParticipantsCountAsLong() {
        return participantsCount != null ? participantsCount.longValue() : 0L;
    }
    
    public Long getOtherUserIdAsLong() {
        return otherUserId != null ? otherUserId.longValue() : null;
    }
    
    public boolean isPrivate() {
        return getParticipantsCountAsLong() == 2;
    }
}
