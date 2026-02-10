package com.pm.chatservice.controller;

import com.pm.chatservice.dto.DialogReadStateDTO;
import com.pm.chatservice.dto.DialogResponseDTO;
import com.pm.chatservice.dto.ReadReceiptDTO;
import com.pm.chatservice.service.DialogReadService;
import com.pm.chatservice.service.DialogService;
import com.pm.common.web.RequestUserContext;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dialogs")
public class DialogController {
    private final DialogService dialogService;
    private final DialogReadService dialogReadService;
    private final RequestUserContext requestUserContext;

    @GetMapping
    public List<DialogResponseDTO> getDialogs() {
        return dialogService.getDialogs();
    }

    @GetMapping("/{dialogId}")
    public DialogResponseDTO getDialogById(@PathVariable Long dialogId) {
        return dialogService.getDialogById(dialogId);
    }

    @GetMapping("/{dialogId}/read-state")
    public DialogReadStateDTO getDialogReadState(@PathVariable Long dialogId) {
        Long userId = requestUserContext.getCurrentUserId();
        return dialogReadService.getReadState(dialogId, userId);
    }

    @PostMapping("/{dialogId}/read")
    public DialogReadStateDTO markDialogRead(
            @PathVariable Long dialogId,
            @Valid @RequestBody ReadReceiptDTO dto
    ) {
        Long userId = requestUserContext.getCurrentUserId();
        return dialogReadService.markRead(dialogId, userId, dto);
    }
}