package com.pm.chatservice.controller;

import com.pm.chatservice.dto.DialogResponseDTO;
import com.pm.chatservice.service.DialogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dialogs")
public class DialogController {
    private final DialogService dialogService;

    @GetMapping
    public List<DialogResponseDTO> getDialogs() {
        return dialogService.getDialogs();
    }

    @GetMapping("/{dialogId}")
    public DialogResponseDTO getDialogById(@PathVariable Long dialogId) {
        return dialogService.getDialogById(dialogId);
    }
}