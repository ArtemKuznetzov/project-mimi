package com.pm.chatservice.repository;

import com.pm.chatservice.entity.DialogParticipant;
import com.pm.chatservice.entity.id.DialogParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DialogParticipantRepository extends JpaRepository<DialogParticipant, DialogParticipantId> {
    boolean existsById_DialogIdAndId_UserId(Long dialogId, Long userId);
}