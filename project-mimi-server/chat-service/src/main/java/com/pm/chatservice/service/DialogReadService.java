package com.pm.chatservice.service;

import com.pm.chatservice.dto.DialogReadStateDTO;
import com.pm.chatservice.dto.ReadReceiptDTO;
import com.pm.chatservice.dto.ReadReceiptEventDTO;
import com.pm.chatservice.entity.DialogUserState;
import com.pm.chatservice.entity.id.DialogUserStateId;
import com.pm.chatservice.repository.DialogUserStateRepository;
import com.pm.chatservice.repository.MessageRepository;
import com.pm.common.web.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DialogReadService {
    private final DialogUserStateRepository dialogUserStateRepository;
    private final MessageRepository messageRepository;
    private final DialogService dialogService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public DialogReadStateDTO getReadState(Long dialogId, Long userId) {
        ensureParticipant(dialogId, userId);
        DialogUserState state = dialogUserStateRepository.findById(new DialogUserStateId(dialogId, userId)).orElse(null);
        Long otherLastReadMessageId = dialogUserStateRepository.findMinOtherLastReadMessageId(dialogId, userId);

        return new DialogReadStateDTO(
                dialogId,
                userId,
                state != null ? state.getLastReadMessageId() : null,
                state != null ? state.getLastReadAt() : null,
                otherLastReadMessageId
        );
    }

    @Transactional
    public DialogReadStateDTO markRead(Long dialogId, Long userId, ReadReceiptDTO dto) {
        ensureParticipant(dialogId, userId);
        Long lastReadMessageId = dto.lastReadMessageId();

        if (lastReadMessageId == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "READ_MESSAGE_ID_REQUIRED", "lastReadMessageId is required");
        }
        if (!messageRepository.existsByIdAndDialog_Id(lastReadMessageId, dialogId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MESSAGE_NOT_FOUND",
                    "Message does not belong to dialog");
        }

        DialogUserStateId id = new DialogUserStateId(dialogId, userId);
        DialogUserState state = dialogUserStateRepository.findById(id)
                .orElseGet(() -> DialogUserState.builder().id(id).build());

        Long currentLastReadMessageId = state.getLastReadMessageId();
        boolean updated = currentLastReadMessageId == null || lastReadMessageId > currentLastReadMessageId;
        if (updated) {
            state.setLastReadMessageId(lastReadMessageId);
            state.setLastReadAt(Instant.now());
            dialogUserStateRepository.save(state);

            messagingTemplate.convertAndSend(
                    "/topic/dialogs/" + dialogId + "/read",
                    new ReadReceiptEventDTO(dialogId, userId, lastReadMessageId, state.getLastReadAt())
            );
        }

        Long otherLastReadMessageId = dialogUserStateRepository.findMinOtherLastReadMessageId(dialogId, userId);

        return new DialogReadStateDTO(
                dialogId,
                userId,
                state.getLastReadMessageId(),
                state.getLastReadAt(),
                otherLastReadMessageId
        );
    }

    private void ensureParticipant(Long dialogId, Long userId) {
        if (!dialogService.isUserParticipant(dialogId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "DIALOG_ACCESS_DENIED",
                    "User is not a participant of this dialog");
        }
    }
}
