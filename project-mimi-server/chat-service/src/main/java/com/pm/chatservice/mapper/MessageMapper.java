package com.pm.chatservice.mapper;

import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.dto.MessageResponseDTO;
import com.pm.chatservice.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "id", source = "message.id")
    @Mapping(target = "userName", source = "user.displayName")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userAvatarId", source = "user.avatarId")
    MessageResponseDTO toDto(Message message, Long dialogId, UserPublicDTO user);
}