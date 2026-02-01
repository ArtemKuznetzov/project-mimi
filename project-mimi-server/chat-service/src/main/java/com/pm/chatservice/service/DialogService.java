package com.pm.chatservice.service;

import com.pm.chatservice.client.AuthUserClient;
import com.pm.chatservice.authclient.model.UserPublicDTO;
import com.pm.chatservice.dto.DialogDataDTO;
import com.pm.chatservice.dto.DialogResponseDTO;
import com.pm.chatservice.repository.DialogRepository;
import com.pm.common.web.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DialogService {
    private final DialogRepository dialogRepository;
    private final AuthUserClient authUserClient;
    private final RequestUserContext requestUserContext;

    @Transactional(readOnly = true)
    public List<DialogResponseDTO> getDialogsByUserId() {
        Long currentUserId = requestUserContext.getCurrentUserId();
        List<DialogDataDTO> dialogDataList = dialogRepository.findDialogDataByUserId(currentUserId);
        
        return dialogDataList.stream()
                .map(dialogData -> {
                    String userName;
                    String userAvatarId;
                    Long userId;
                    
                    if (dialogData.isPrivate()) {
                        Long otherUserId = dialogData.getOtherUserIdAsLong();
                        UserPublicDTO otherUser = Optional.ofNullable(otherUserId)
                                .map(authUserClient::getUser)
                                .orElse(null);
                        
                        userId = otherUserId;
                        userName = Optional.ofNullable(otherUser).map(UserPublicDTO::getDisplayName).orElse(null);
                        userAvatarId = Optional.ofNullable(otherUser).map(UserPublicDTO::getAvatarId).orElse(null);
                    } else {
                        userId = null;
                        userName = dialogData.dialogTitle();
                        userAvatarId = dialogData.dialogAvatarUrl();
                    }

                    return new DialogResponseDTO(
                            dialogData.dialogId(),
                            userId,
                            userName,
                            userAvatarId,
                            dialogData.lastMessageBody(),
                            dialogData.lastMessageDate()
                    );
                })
                .toList();
    }
}
