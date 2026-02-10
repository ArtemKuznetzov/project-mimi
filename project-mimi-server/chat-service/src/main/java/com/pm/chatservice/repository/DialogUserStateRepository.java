package com.pm.chatservice.repository;

import com.pm.chatservice.entity.DialogUserState;
import com.pm.chatservice.entity.id.DialogUserStateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DialogUserStateRepository extends JpaRepository<DialogUserState, DialogUserStateId> {
    @Query("""
            select min(coalesce(state.lastReadMessageId, 0))
            from DialogParticipant participant
            left join DialogUserState state
                on state.id.dialogId = participant.id.dialogId
                and state.id.userId = participant.id.userId
            where participant.id.dialogId = :dialogId
                and participant.id.userId <> :userId
            """)
    Long findMinOtherLastReadMessageId(@Param("dialogId") Long dialogId, @Param("userId") Long userId);
}