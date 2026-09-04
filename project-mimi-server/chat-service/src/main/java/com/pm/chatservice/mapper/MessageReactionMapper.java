package com.pm.chatservice.mapper;

import com.pm.chatservice.dto.MessageReactionResponseDTO;
import com.pm.chatservice.entity.MessageReaction;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component 
public class MessageReactionMapper {
    public List<MessageReactionResponseDTO.ReactionGroup> toDto(List<MessageReaction> messageReactions) {
        if (messageReactions == null || messageReactions.isEmpty()) {
            return List.of();
        }
        return messageReactions.stream()
                .collect(Collectors.groupingBy(r -> r.getEmoji()))
                .entrySet().stream()
                .map(e -> new MessageReactionResponseDTO.ReactionGroup(
                        e.getKey(),
                        e.getValue().stream().map(r -> r.getUserId()).toList()
                ))
                .toList();
    }
}
