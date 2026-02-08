import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetDialogByIdQuery } from "@/features/dialogs/api/dialogsApi";
import { useGetMessagesQuery } from "@/features/messages/api/messagesApi";
import { MessageList, type MessageListHandle } from "@/features/messages/ui/MessageList";
import { MessageInput } from "@/features/messages/ui/MessageInput";
import { MessageHeader } from "@/features/messages/ui/MessageHeader";
import { useDialogMessagesState } from "@/features/messages/useDialogMessagesState";
import { useAppSelector } from "@/app/hooks";

export const MessagesPage = () => {
  const { dialogId } = useParams();
  const dialogIdInt = Number(dialogId);

  const { data: dialog } = useGetDialogByIdQuery(dialogIdInt);
  const { data: messagesData = [] } = useGetMessagesQuery(dialogIdInt);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const listHandleRef = useRef<MessageListHandle | null>(null);

  const { messages, onSendMessage } = useDialogMessagesState({
    dialogId: dialogIdInt,
    messagesData,
    currentUserId,
    listHandleRef,
  });

  return (
    <div className="space-y-6">
      <MessageHeader dialog={dialog} />
      <MessageList
        messages={messages}
        dialogId={dialogIdInt}
        ref={listHandleRef}
      />
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};
