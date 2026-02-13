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
           "m.id, " +
           "m.body, " +
           "m.createdAt, " +
           "m.authorId) " +
           "FROM Dialog d " +
           "LEFT JOIN Message m ON m.id = (" +
           "    SELECT MAX(m2.id) FROM Message m2 WHERE m2.dialog.id = d.id AND m2.isDeleted = false" +
           ") " +
           "WHERE EXISTS (SELECT 1 FROM DialogParticipant p1 " +
           "              WHERE p1.id.dialogId = d.id AND p1.id.userId = :currentUserId)")
    List<DialogDataDTO> findDialogDataByUserId(@Param("currentUserId") Long currentUserId);

    @Query("SELECT new com.pm.chatservice.dto.DialogDataDTO(" +
           "d.id, " +
           "(SELECT COUNT(p_count.id.userId) FROM DialogParticipant p_count " +
           " WHERE p_count.id.dialogId = d.id), " +
           "(SELECT MIN(p2.id.userId) FROM DialogParticipant p2 " +
           " WHERE p2.id.dialogId = d.id AND p2.id.userId != :currentUserId), " +
           "d.title, " +
           "d.avatarUrl, " +
           "m.id, " +
           "m.body, " +
           "m.createdAt, " +
           "m.authorId) " +
           "FROM Dialog d " +
           "LEFT JOIN Message m ON m.id = (" +
           "    SELECT MAX(m2.id) FROM Message m2 WHERE m2.dialog.id = d.id AND m2.isDeleted = false" +
           ") " +
           "WHERE d.id = :dialogId " +
           "AND EXISTS (SELECT 1 FROM DialogParticipant p1 " +
           "            WHERE p1.id.dialogId = d.id AND p1.id.userId = :currentUserId)")
    java.util.Optional<DialogDataDTO> findDialogDataByUserIdAndDialogId(
            @Param("currentUserId") Long currentUserId,
            @Param("dialogId") Long dialogId
    );
}
