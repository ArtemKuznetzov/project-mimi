package com.pm.chatservice.repository;

import com.pm.chatservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByDialog_Id(Long dialogId);

    boolean existsByIdAndDialog_Id(Long id, Long dialogId);
}
