package com.pm.chatservice.repository;

import com.pm.chatservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByDialog_Id(Long dialogId);
    Optional<Message> findByIdAndDialog_Id(Long messageId, Long dialogId);
    Optional<Message> findTopByDialog_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long id);

    boolean existsByIdAndDialog_Id(Long id, Long dialogId);
}
