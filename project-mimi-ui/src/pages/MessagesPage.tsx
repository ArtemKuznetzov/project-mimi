import {useMemo, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import { useGetDialogByIdQuery } from "@/features/dialogs/api/dialogsApi";
import { useGetMessagesQuery } from "@/features/messages/api/messagesApi";
import {MessageList, type MessageListHandle, type MessageListProps} from "@/features/messages/ui/MessageList";
import { MessageInput } from "@/features/messages/ui/MessageInput";
import { MessageHeader } from "@/features/messages/ui/MessageHeader";
import { useDialogMessagesState } from "@/features/messages/useDialogMessagesState";
import { useDialogReadState } from "@/features/messages/useDialogReadState";
import { useAppSelector } from "@/app/hooks";
import type {UiMessage} from "@/entities/message";
import type {MessageCreatePayload} from "@/shared/lib/websoket/types";

export const MessagesPage = () => {
  const { dialogId } = useParams();
  const dialogIdInt = Number(dialogId);

  const { data: dialog } = useGetDialogByIdQuery(dialogIdInt);
  const { data: messagesData = [] } = useGetMessagesQuery(dialogIdInt);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const listHandleRef = useRef<MessageListHandle | null>(null);
  const [messageForReply, setMessageForReply] = useState<UiMessage | undefined>(undefined);

  const { otherLastReadMessageId, onReadCandidate, onReadReceipt } = useDialogReadState({
    dialogId: dialogIdInt,
    currentUserId,
  });

  const { messages, onSendMessage, onDeleteMessage } = useDialogMessagesState({
    dialogId: dialogIdInt,
    messagesData,
    currentUserId,
    listHandleRef,
    onReadReceipt,
  });

  const onCloseReplyBlock = () => {
    setMessageForReply(undefined)
  }

  const handleSendMessage = (payload: MessageCreatePayload) => {
    onSendMessage(payload, messageForReply)
    onCloseReplyBlock()
  }

  const messageActions: MessageListProps['messageActions'] = useMemo(() => ({
    onReadCandidate,
    onDeleteMessage,
    onReplyMessage: (message) => setMessageForReply(message),
    onEditMessage: () => {}
  }), [onDeleteMessage, onReadCandidate])

  return (
    <div className="space-y-6">
      <MessageHeader dialog={dialog} />
      <MessageList
        messages={messages}
        dialogId={dialogIdInt}
        otherLastReadMessageId={otherLastReadMessageId}
        messageActions={messageActions}
        replyMessage={messageForReply}
        onCloseReply={onCloseReplyBlock}
        ref={listHandleRef}
      />

      <div className="relative">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};
