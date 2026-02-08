package com.pm.chatservice.controller;

import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.service.DialogService;
import com.pm.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final DialogService dialogService;

    @MessageMapping("/dialogs/{dialogId}/send")
    public void sendMessage(@DestinationVariable Long dialogId, MessageCreateDTO dto, Principal principal) {
        Long userId = getUserIdInDialog(dialogId, principal);
        MessageResponseDTO saved = messageService.saveMessage(dialogId, userId, dto);

        if (saved != null) {
            messagingTemplate.convertAndSend("/topic/dialogs/" + dialogId, saved);
            log.debug("Message sent to dialog {} by user {}", dialogId, userId);
        }
    }

    private Long getUserIdInDialog(Long dialogId, Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized attempt to send message to dialog {}", dialogId);
            throw new AccessDeniedException("User not authenticated");
        }

        Long userId = Long.parseLong(principal.getName());

        if (!dialogService.isUserParticipant(dialogId, userId)) {
            log.warn("User {} attempted to send message to dialog {} without being a participant", userId, dialogId);
            throw new AccessDeniedException("User is not a participant of this dialog");
        }

        return userId;
    }
}