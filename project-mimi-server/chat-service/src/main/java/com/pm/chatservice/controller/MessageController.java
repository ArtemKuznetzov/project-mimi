package com.pm.chatservice.controller;

import com.pm.chatservice.dto.MessageCreateDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{dialogId}")
    public List<MessageResponseDTO> getMessages(@PathVariable Long dialogId) {
        return messageService.getMessagesByDialogId(dialogId);
    }

    @PostMapping(value = "/{dialogId}/message/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @PathVariable Long dialogId,
            @RequestPart(value = "body", required = false) String body,
            @RequestPart(value = "replyMessageId", required = false) Long replyMessageId,
            @RequestPart(value = "clientId", required = false) String clientId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal Long userId) {
        MessageCreateDTO dto = new MessageCreateDTO(body, clientId, replyMessageId);
        MessageResponseDTO saved = messageService.saveMessage(dialogId, userId, dto, files);

        messagingTemplate.convertAndSend("/topic/dialogs/" + dialogId, saved);
        return ResponseEntity.ok(saved);
    }
}
