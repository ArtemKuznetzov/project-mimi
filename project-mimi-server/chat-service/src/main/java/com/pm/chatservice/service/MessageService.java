package com.pm.chatservice.service;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.client.AuthServiceClient;
import com.pm.chatservice.client.MediaServiceClient;
import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.dto.MessageUpdateDTO;
import com.pm.chatservice.entity.Dialog;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.entity.MessageAttachment;
import com.pm.chatservice.mapper.MessageMapper;
import com.pm.chatservice.mediaclient.model.MediaFileInfoDTO;
import com.pm.chatservice.repository.DialogParticipantRepository;
import com.pm.chatservice.repository.DialogRepository;
import com.pm.chatservice.repository.MessageRepository;
import com.pm.common.web.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final AuthServiceClient authServiceClient;
    private final MediaServiceClient mediaServiceClient;
    private final MessageMapper messageMapper;
    private final DialogRepository dialogRepository;
    private final DialogParticipantRepository dialogParticipantRepository;

    public List<MessageResponseDTO> getMessagesByDialogId(Long dialogId) {
        List<Message> messageList = messageRepository.findByDialog_IdOrderByCreatedAtAsc(dialogId);

        Set<Long> authorIds = messageList.stream()
                .map(Message::getAuthorId)
                .collect(Collectors.toSet());

        Map<Long, UserPublicDTO> dialogUsers = authorIds.stream()
                .collect(Collectors.toMap(id -> id, authServiceClient::getUser));

        Map<Long, Message> messagesById = messageList.stream()
                .collect(Collectors.toMap(Message::getId, message -> message));


        return messageList
                .stream()
                .map(message -> {
                    MessageResponseDTO replyDto = null;
                    Long replyMessageId = message.getReplyMessageId();
                    if (replyMessageId != null) {
                        Message replyMessage = messagesById.get(replyMessageId);
                        if (replyMessage != null) {
                            UserPublicDTO replyUser = dialogUsers.get(replyMessage.getAuthorId());
                            replyDto = messageMapper.toDto(replyMessage, dialogId, replyUser, null, null);
                        }
                    }
                    return messageMapper.toDto(message, dialogId, dialogUsers.get(message.getAuthorId()), null, replyDto);
                })
                .toList();
    }

    @Transactional
    public MessageResponseDTO saveMessage(Long dialogId, Long userId, MessageCreateDTO dto, List<MultipartFile> files) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(dto, "message payload must not be null");

        String body = dto.body();
        boolean hasText = body != null && !body.trim().isEmpty();
        List<MultipartFile> nonEmptyFiles = files == null
                ? Collections.emptyList()
                : files.stream()
                .filter(Objects::nonNull)
                .filter(file -> !file.isEmpty())
                .toList();
        boolean hasAttachments = !nonEmptyFiles.isEmpty();
        if (!hasText && !hasAttachments) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "MESSAGE_EMPTY",
                    "Message must contain text or at least one attachment"
            );
        }

        UserPublicDTO user = authServiceClient.getUser(userId);
        Long replyMessageId = dto.replyMessageId();
        MessageResponseDTO replyDto = null;
        if (replyMessageId != null) {
            replyDto = buildReplyDto(dialogId, replyMessageId);
            if (replyDto == null) {
                throw new ApiException(HttpStatus.NOT_FOUND, "REPLY_MESSAGE_NOT_FOUND", "Reply message not found");
            }
        }

        List<MessageAttachment> attachments = Collections.emptyList();
        if (hasAttachments) {
            List<MediaFileInfoDTO> uploaded = mediaServiceClient.uploadFiles(nonEmptyFiles);
            attachments = IntStream.range(0, uploaded.size())
                    .mapToObj(i -> {
                        MediaFileInfoDTO info = uploaded.get(i);
                        return MessageAttachment.builder()
                                .objectName(info.getObjectName())
                                .fileName(info.getOriginalName())
                                .contentType(info.getContentType())
                                .extension(info.getExtension())
                                .size(info.getSize().intValue())
                                .attachmentOrder(i)
                                .build();
                    })
                    .toList();
        }

        Message message = new Message();
        message.setBody(hasText ? body : "");
        message.setAuthorId(userId);
        message.setCreatedAt(Instant.now());
        message.setReplyMessageId(replyMessageId);
        message.setAttachments(attachments);

        Dialog dialog = dialogRepository.getReferenceById(dialogId);
        message.setDialog(dialog);

        Message saved = messageRepository.save(message);
        dialog.setLastMessageId(saved.getId());
        dialog.setUpdatedAt(saved.getCreatedAt());
        return messageMapper.toDto(saved, dialogId, user, dto.clientId(), replyDto);
    }

    @Transactional
    public MessageResponseDTO deleteMessage(Long dialogId, Long messageId, Long userId) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(messageId, "messageId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");

        UserPublicDTO user = authServiceClient.getUser(userId);
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

        MessageResponseDTO replyDto = buildReplyDto(dialogId, message.getReplyMessageId());
        return messageMapper.toDto(saved, dialogId,user,null, replyDto);
    }

    @Transactional
    public MessageResponseDTO updateMessage(Long dialogId, Long messageId, Long userId, MessageUpdateDTO dto) {
        Objects.requireNonNull(dialogId, "dialogId must not be null");
        Objects.requireNonNull(messageId, "messageId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(dto, "message payload must not be null");

        UserPublicDTO user = authServiceClient.getUser(userId);

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
        MessageResponseDTO replyDto = buildReplyDto(dialogId, message.getReplyMessageId());
        return messageMapper.toDto(saved, dialogId, user, null, replyDto);
    }

    private MessageResponseDTO buildReplyDto(Long dialogId, Long replyMessageId) {
        if (replyMessageId == null) {
            return null;
        }
        Message replyMessage = messageRepository.findByIdAndDialog_Id(replyMessageId, dialogId).orElse(null);
        if (replyMessage == null) {
            return null;
        }
        UserPublicDTO replyUser = authServiceClient.getUser(replyMessage.getAuthorId());
        return messageMapper.toDto(replyMessage, dialogId, replyUser, null, null);
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