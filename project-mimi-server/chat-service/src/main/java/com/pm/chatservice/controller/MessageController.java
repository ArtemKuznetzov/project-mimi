package com.pm.chatservice.controller;

import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/{dialogId}")
    public List<MessageResponseDTO> getMessages(@PathVariable Long dialogId) {
        return messageService.getMessagesByDialogId(dialogId);
    }
}
