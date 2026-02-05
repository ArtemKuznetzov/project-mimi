package com.pm.chatservice.service;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.client.AuthUserClient;
import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.entity.Dialog;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.mapper.MessageMapper;
import com.pm.chatservice.repository.DialogRepository;
import com.pm.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final AuthUserClient authUserClient;
    private final MessageMapper messageMapper;
    private final DialogRepository dialogRepository;

    public List<MessageResponseDTO> getMessagesByDialogId(Long dialogId) {
        List<Message> messageList = messageRepository.findByDialog_Id(dialogId);

        Set<Long> authorIds = messageList.stream()
                .map(Message::getAuthorId)
                .collect(Collectors.toSet());

        Map<Long, UserPublicDTO> dialogUsers = authorIds.stream()
                .collect(Collectors.toMap(id -> id, authUserClient::getUser));

        return messageList
                .stream()
                .map(m -> messageMapper.toDto(m,dialogId,dialogUsers.get(m.getAuthorId())))
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
        return messageMapper.toDto(saved, dialogId, user);
    }
}