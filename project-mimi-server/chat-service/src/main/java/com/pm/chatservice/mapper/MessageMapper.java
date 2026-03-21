package com.pm.chatservice.mapper;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.dto.AttachmentResponseDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.entity.Message;
import com.pm.chatservice.entity.MessageAttachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "id", source = "message.id")
    @Mapping(target = "dialogId", source = "dialogId")
    @Mapping(target = "body", source = "message.body")
    @Mapping(target = "isEdited", source = "message.isEdited")
    @Mapping(target = "createdAt", source = "message.createdAt")
    @Mapping(target = "isDeleted", source = "message.isDeleted")
    @Mapping(target = "userName", source = "user.displayName")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userAvatarId", source = "user.avatarId")
    @Mapping(target = "clientId", source = "clientId")
    @Mapping(target = "replyMessage", source = "replyMessage")
    @Mapping(target = "attachments", source = "message.attachments")
    MessageResponseDTO toDto(Message message, Long dialogId, UserPublicDTO user, String clientId, MessageResponseDTO replyMessage);

    AttachmentResponseDTO toAttachmentDto(MessageAttachment a);
}