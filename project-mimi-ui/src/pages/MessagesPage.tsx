import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetDialogByIdQuery } from "@/features/dialogs/api/dialogsApi";
import { useGetMessagesQuery } from "@/features/messages/api/messagesApi";
import { MessageList, type MessageListHandle } from "@/features/messages/ui/MessageList";
import { MessageInput } from "@/features/messages/ui/MessageInput";
import { MessageHeader } from "@/features/messages/ui/MessageHeader";
import { useDialogMessagesState } from "@/features/messages/useDialogMessagesState";
import { useDialogReadState } from "@/features/messages/useDialogReadState";
import { useAppSelector } from "@/app/hooks";

export const MessagesPage = () => {
  const { dialogId } = useParams();
  const dialogIdInt = Number(dialogId);

  const { data: dialog } = useGetDialogByIdQuery(dialogIdInt);
  const { data: messagesData = [] } = useGetMessagesQuery(dialogIdInt);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const listHandleRef = useRef<MessageListHandle | null>(null);

  const { otherLastReadMessageId, onReadCandidate, onReadReceipt } = useDialogReadState({
    dialogId: dialogIdInt,
    currentUserId,
  });

  const { messages, onSendMessage, onDeleteMessage, onEditMessage } = useDialogMessagesState({
    dialogId: dialogIdInt,
    messagesData,
    currentUserId,
    listHandleRef,
    onReadReceipt,
  });

  return (
    <div className="space-y-6">
      <MessageHeader dialog={dialog} />
      <MessageList
        messages={messages}
        dialogId={dialogIdInt}
        otherLastReadMessageId={otherLastReadMessageId}
        onReadCandidate={onReadCandidate}
        onDeleteMessage={onDeleteMessage}
        onEditMessage={onEditMessage}
        ref={listHandleRef}
      />
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};
