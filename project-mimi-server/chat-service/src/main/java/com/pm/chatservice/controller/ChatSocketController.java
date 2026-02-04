package com.pm.chatservice.controller;

import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/dialogs/{dialogId}/send")
    public void sendMessage(@DestinationVariable Long dialogId, MessageCreateDTO dto) {
        MessageResponseDTO saved = messageService.saveMessage(dialogId, dto);
        if (saved != null) {
            messagingTemplate.convertAndSend("/topic/dialogs/" + dialogId, saved);
        }
    }
}