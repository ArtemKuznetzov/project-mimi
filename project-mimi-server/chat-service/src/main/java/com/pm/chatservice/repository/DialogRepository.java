package com.pm.chatservice.repository;

import com.pm.chatservice.entity.Dialog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DialogRepository extends JpaRepository<Dialog, Long> {
    List<Dialog> findDistinctByParticipantsUserId(Long userId);
}
