package com.pm.chatservice.service;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.client.AuthUserClient;
import com.pm.chatservice.dto.DialogDataDTO;
import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.dto.MessageUpdateDTO;
import com.pm.chatservice.entity.Dialog;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.mapper.MessageMapper;
import com.pm.chatservice.repository.DialogParticipantRepository;
import com.pm.chatservice.repository.DialogRepository;
import com.pm.chatservice.repository.MessageRepository;
import com.pm.common.web.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final AuthUserClient authUserClient;
    private final MessageMapper messageMapper;
    private final DialogRepository dialogRepository;
    private final DialogParticipantRepository dialogParticipantRepository;

    public List<MessageResponseDTO> getMessagesByDialogId(Long dialogId) {
        List<Message> messageList = messageRepository.findByDialog_Id(dialogId);

        Set<Long> authorIds = messageList.stream()
                .map(Message::getAuthorId)
                .collect(Collectors.toSet());

        Map<Long, UserPublicDTO> dialogUsers = authorIds.stream()
                .collect(Collectors.toMap(id -> id, authUserClient::getUser));

        return messageList
                .stream()
                .map(m -> messageMapper.toDto(m, dialogId, dialogUsers.get(m.getAuthorId()), null))
                .toList();
    }

    @Transactional
    public MessageResponseDTO saveMessage(Long dialogId, Long userId, MessageCreateDTO dto) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(dto, "message payload must not be null");

        UserPublicDTO user = authUserClient.getUser(userId);

        Message message = new Message();
        message.setBody(dto.body());
        message.setAuthorId(userId);
        message.setCreatedAt(Instant.now());

        Dialog dialog = dialogRepository.getReferenceById(dialogId);
        message.setDialog(dialog);

        Message saved = messageRepository.save(message);
        dialog.setLastMessageId(saved.getId());
        dialog.setUpdatedAt(saved.getCreatedAt());
        return messageMapper.toDto(saved, dialogId, user, dto.clientId());
    }

    @Transactional
    public MessageResponseDTO deleteMessage(Long dialogId, Long messageId, Long userId) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(messageId, "messageId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");

        UserPublicDTO user = authUserClient.getUser(userId);
        Message message = getMessageFromDialog(dialogId, messageId, userId);
        Dialog dialog = message.getDialog();

        message.setIsDeleted(true);
        message.setUpdatedAt(Instant.now());
        Message saved = messageRepository.save(message);

        if (Objects.equals(dialog.getLastMessageId(), message.getId())) {
            Message lastMessage = messageRepository
                    .findTopByDialog_IdAndIsDeletedFalseOrderByCreatedAtDesc(dialogId)
                    .orElse(null);
            dialog.setLastMessageId(lastMessage != null ? lastMessage.getId() : null);
            dialog.setUpdatedAt(Instant.now());
        }

        return messageMapper.toDto(saved, dialogId,user,null);
    }

    @Transactional
    public MessageResponseDTO updateMessage(Long dialogId, Long messageId, Long userId, MessageUpdateDTO dto) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(messageId, "messageId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(dto, "message payload must not be null");

        UserPublicDTO user = authUserClient.getUser(userId);

        Message message = getMessageFromDialog(dialogId, messageId, userId);
        if (Boolean.TRUE.equals(message.getIsDeleted())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MESSAGE_DELETED", "Message was deleted");
        }
        String body = dto.body();
        if (body == null || body.trim().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MESSAGE_BODY_EMPTY", "Message body is empty");
        }
        message.setBody(body);
        message.setIsEdited(true);
        message.setUpdatedAt(Instant.now());

        Message saved = messageRepository.save(message);
        return messageMapper.toDto(saved, dialogId,user,null);
    }

    private Message getMessageFromDialog(Long dialogId, Long messageId, Long userId) {
        Message message = messageRepository.findByIdAndDialog_Id(messageId, dialogId)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
                );

        if (!dialogParticipantRepository.existsById_DialogIdAndId_UserId(dialogId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "DIALOG_ACCESS_DENIED", "User is not a participant");
        }

        if (!Objects.equals(userId, message.getAuthorId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "USER_NOT_AUTHOR", "User is not an author of the message");
        }

        return message;
    }
}