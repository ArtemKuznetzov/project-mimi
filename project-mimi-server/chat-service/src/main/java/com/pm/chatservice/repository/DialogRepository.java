package com.pm.chatservice.repository;

import com.pm.chatservice.dto.DialogDataDTO;
import com.pm.chatservice.entity.Dialog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DialogRepository extends JpaRepository<Dialog, Long> {
    @Query("SELECT new com.pm.chatservice.dto.DialogDataDTO(" +
           "d.id, " +
           "(SELECT COUNT(p_count.id.userId) FROM DialogParticipant p_count " +
           " WHERE p_count.id.dialogId = d.id), " +
           "(SELECT MIN(p2.id.userId) FROM DialogParticipant p2 " +
           " WHERE p2.id.dialogId = d.id AND p2.id.userId != :currentUserId), " +
           "d.title, " +
           "d.avatarUrl, " +
           "d.lastMessageId, " +
           "m.body, " +
           "m.createdAt) " +
           "FROM Dialog d " +
           "LEFT JOIN Message m ON m.id = d.lastMessageId " +
           "WHERE EXISTS (SELECT 1 FROM DialogParticipant p1 " +
           "              WHERE p1.id.dialogId = d.id AND p1.id.userId = :currentUserId)")
    List<DialogDataDTO> findDialogDataByUserId(@Param("currentUserId") Long currentUserId);
}
