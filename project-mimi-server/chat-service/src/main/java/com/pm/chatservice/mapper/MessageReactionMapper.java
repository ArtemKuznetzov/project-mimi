package com.pm.chatservice.mapper;

import com.pm.chatservice.dto.MessageReactionResponseDTO;
import com.pm.chatservice.entity.MessageReaction;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MessageReactionMapper {
    default List<MessageReactionResponseDTO.ReactionGroup> toDto(List<MessageReaction> messageReactions) {
        if (messageReactions == null || messageReactions.isEmpty()) {
            return List.of();
        }
        return messageReactions.stream()
                .collect(Collectors.groupingBy(MessageReaction::getEmoji))
                .entrySet().stream()
                .map(e -> new MessageReactionResponseDTO.ReactionGroup(
                        e.getKey(),
                        e.getValue().stream().map(MessageReaction::getUserId).toList()
                ))
                .toList();
    }
}
