package com.pm.chatservice.service;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.client.AuthUserClient;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.mapper.MessageMapper;
import com.pm.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final AuthUserClient authUserClient;
    private final MessageMapper messageMapper;

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
}