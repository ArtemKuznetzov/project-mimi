package com.pm.chatservice.service;

import com.pm.chatservice.dto.MessageReactionDTO;
import com.pm.chatservice.dto.MessageReactionResponseDTO;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.entity.MessageReaction;
import com.pm.chatservice.mapper.MessageReactionMapper;
import com.pm.chatservice.repository.MessageReactionRepository;
import com.pm.chatservice.repository.MessageRepository;
import com.pm.common.web.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MessageReactionService {
    private final MessageReactionRepository messageReactionRepository;
    private final MessageRepository messageRepository;
    private final MessageReactionMapper messageReactionMapper;

    @Transactional
    public MessageReactionResponseDTO toggle(MessageReactionDTO messageReactionDTO, Long userId, Long dialogId, Long messageId) {
        Message message = messageRepository.findByIdAndDialog_Id(messageId, dialogId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
        );

        boolean exists = messageReactionRepository.existsByMessageIdAndUserIdAndEmoji(message.getId(), userId, messageReactionDTO.emoji());

        if (exists) {
            messageReactionRepository.deleteByMessageIdAndUserIdAndEmoji(message.getId(), userId, messageReactionDTO.emoji());
        } else {
            MessageReaction messageReaction = MessageReaction.builder()
                    .message(message)
                    .userId(userId)
                    .emoji(messageReactionDTO.emoji())
                    .createdAt(Instant.now())
                    .build();
            messageReactionRepository.save(Objects.requireNonNull(messageReaction, "messageReaction"));
        }
        List<MessageReaction> reactions = messageReactionRepository.findByMessageId(messageId);
        List<MessageReactionResponseDTO.ReactionGroup> reactionsDto = messageReactionMapper.toDto(reactions);

        return new MessageReactionResponseDTO(messageId, reactionsDto);
    }
}
