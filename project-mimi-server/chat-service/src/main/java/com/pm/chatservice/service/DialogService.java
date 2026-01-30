package com.pm.chatservice.service;

import com.pm.chatservice.client.AuthUserClient;
import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.dto.DialogResponseDTO;
import com.pm.chatservice.entity.DialogParticipant;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.mapper.DialogMapper;
import com.pm.chatservice.repository.DialogRepository;
import com.pm.chatservice.repository.MessageRepository;
import com.pm.common.web.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DialogService {
    private final DialogRepository dialogRepository;
    private final DialogMapper dialogMapper;
    private final MessageRepository messageRepository;
    private final AuthUserClient authUserClient;
    private final RequestUserContext requestUserContext;

    @Transactional(readOnly = true)
    public List<DialogResponseDTO> getDialogsByUserId() {
        Long currentUserId = requestUserContext.getCurrentUserId();
        return dialogRepository.findDistinctByParticipantsUserId(currentUserId)
                .stream()
                .map(dialog -> {
                    Long otherUserId = dialog.getParticipants().stream()
                            .map(DialogParticipant::getUserId)
                            .filter(participantUserId -> participantUserId != null && !participantUserId.equals(currentUserId))
                            .findFirst()
                            .orElse(null);

                    Optional<Message> lastMessage = Optional.ofNullable(dialog.getLastMessageId())
                            .flatMap(messageRepository::findById);

                    String lastMessageBody = lastMessage.map(Message::getBody).orElse(null);
                    LocalDateTime lastMessageDate = lastMessage.map(Message::getCreatedAt).orElse(null);

                    UserPublicDTO otherUser = Optional.ofNullable(otherUserId)
                            .map(authUserClient::getUser)
                            .orElse(null);

                    String userName = Optional.ofNullable(otherUser).map(UserPublicDTO::getDisplayName).orElse(null);
                    String userAvatarUrl = Optional.ofNullable(otherUser).map(UserPublicDTO::getAvatarUrl).orElse(null);

                    return dialogMapper.toDialogResponse(
                            dialog,
                            otherUserId,
                            userName,
                            userAvatarUrl,
                            lastMessageBody,
                            lastMessageDate
                    );
                })
                .toList();
    }
}
