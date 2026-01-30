package com.pm.chatservice.mapper;

import com.pm.chatservice.dto.DialogResponseDTO;
import com.pm.chatservice.entity.Dialog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface DialogMapper {
    @Mapping(target = "id", source = "dialog.id")
    DialogResponseDTO toDialogResponse(
            Dialog dialog,
            Long userId,
            String userName,
            String userAvatarUrl,
            String lastMessageBody,
            LocalDateTime lastMessageDate
    );
}