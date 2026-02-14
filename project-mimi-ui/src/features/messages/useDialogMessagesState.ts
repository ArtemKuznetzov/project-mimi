import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { MessageResponseDTO } from "@/shared/api/generated";
import { useChatWebsoket } from "@/shared/lib/websoket/useChatWebsoket";
import type {MessageAction, MessageCreatePayload, ReadReceiptEvent} from "@/shared/lib/websoket/types";
import type { UiMessage } from "@/entities/message";
import type { MessageListHandle } from "@/features/messages/ui/MessageList";

type UseDialogMessagesStateOptions = {
  dialogId: number;
  messagesData: MessageResponseDTO[];
  currentUserId: number | null;
  listHandleRef: RefObject<MessageListHandle | null>;
  onReadReceipt?: (event: ReadReceiptEvent) => void;
};

type UseDialogMessagesStateResult = {
  messages: UiMessage[];
  onSendMessage: (payload: MessageCreatePayload, replyMessage?: UiMessage) => boolean;
  onDeleteMessage: (messageId: number) => boolean;
  onEditMessage: (messageId: number, body: string) => boolean;
};

export const useDialogMessagesState = ({
  dialogId,
  messagesData,
  currentUserId,
  listHandleRef,
  onReadReceipt,
}: UseDialogMessagesStateOptions): UseDialogMessagesStateResult => {
  const [liveMessagesByDialog, setLiveMessagesByDialog] = useState<Record<number, MessageResponseDTO[]>>({});
  const [localMessagesByDialog, setLocalMessagesByDialog] = useState<Record<number, UiMessage[]>>({});

  const pendingScrollRef = useRef<string | null>(null);

  const handleMessage = useCallback(
    (message: MessageResponseDTO, action: MessageAction) => {
      setLiveMessagesByDialog((prev) => {
        const current = prev[dialogId] ?? [];
        const existsInLive = current.some((item) => item.id === message.id);
        const existsInInitial = messagesData.some((item) => item.id === message.id);
        if (action === "update" || action === "delete") {
          if (existsInLive) {
            return {
              ...prev,
              [dialogId]: current.map((item) => (item.id === message.id ? message : item)),
            };
          }
          return {
            ...prev,
            [dialogId]: [...current, message],
          };
        }

        if (existsInLive || existsInInitial) {
          return prev;
        }

        return {
          ...prev,
          [dialogId]: [...current, message],
        };
      });

      if (message.clientId) {
        const clientId = message.clientId;
        setLocalMessagesByDialog((prev) => {
          const current = prev[dialogId] ?? [];
          const filtered = current.filter((item) => item.clientId !== clientId);
          if (filtered.length === current.length) {
            return prev;
          }
          return {
            ...prev,
            [dialogId]: filtered,
          };
        });
      }

      if (currentUserId !== null && message.userId === currentUserId && action === "send") {
        requestAnimationFrame(() => listHandleRef.current?.scrollToBottom("smooth"));
      }
    },
    [dialogId, messagesData, currentUserId, listHandleRef],
  );

  const { sendMessage, sendUpdateMessage, sendDeleteMessage } = useChatWebsoket({
    dialogId,
    onMessage: handleMessage,
    onReadReceipt,
  });

  const onSendMessage: UseDialogMessagesStateResult['onSendMessage'] = useCallback(
    (payload, replyMessage) => {
      if (!Number.isFinite(dialogId) || currentUserId === null) {
        return false;
      }
      const clientId = crypto.randomUUID();
      pendingScrollRef.current = clientId;
      const optimisticMessage: UiMessage = {
        id: -Date.now(),
        dialogId,
        body: payload.body,
        isEdited: false,
        createdAt: new Date().toISOString(),
        userName: "",
        userId: currentUserId,
        clientId,
        replyMessage,
        localStatus: "pending",
      };
      setLocalMessagesByDialog((prev) => ({
        ...prev,
        [dialogId]: [...(prev[dialogId] ?? []), optimisticMessage],
      }));

      const isSent = sendMessage({ ...payload, replyMessageId: replyMessage?.id, clientId });
      if (!isSent) {
        setLocalMessagesByDialog((prev) => ({
          ...prev,
          [dialogId]: (prev[dialogId] ?? []).map((message) =>
            message.clientId === clientId ? { ...message, localStatus: "failed" } : message,
          ),
        }));
      }
      return isSent;
    },
    [dialogId, currentUserId, sendMessage],
  );

  const onDeleteMessage = useCallback(
    (messageId: number) => {
      if (!Number.isFinite(dialogId) || !Number.isFinite(messageId) || currentUserId === null) {
        return false;
      }
      const isSent = sendDeleteMessage(dialogId, messageId);
      return isSent;
    }, [currentUserId, dialogId, sendDeleteMessage]
  )

  const onEditMessage = useCallback(
    (messageId: number, body: string)=> {
      if (!Number.isFinite(dialogId) || !Number.isFinite(messageId) || currentUserId === null) {
        return false;
      }
      const isSent = sendUpdateMessage(dialogId, messageId, body);
      return isSent;
    }, [dialogId, currentUserId, sendUpdateMessage]
  )

  const messages = useMemo(() => {
    const liveMessages = liveMessagesByDialog[dialogId] ?? [];
    const localMessages = localMessagesByDialog[dialogId] ?? [];
    if (liveMessages.length === 0) {
      return [...messagesData, ...localMessages] as UiMessage[];
    }
    const merged = [...messagesData] as UiMessage[];
    for (const message of liveMessages) {
      const exists = merged.some((item) => item.id === message.id);
      if (!exists) {
        merged.push(message);
      }
    }
    const serverClientIds = new Set<string>();
    for (const message of merged) {
      if (message.clientId) {
        serverClientIds.add(message.clientId);
      }
    }
    const filteredLocal = localMessages.filter(
      (message) => !message.clientId || !serverClientIds.has(message.clientId),
    );
    return [...merged, ...filteredLocal] as UiMessage[];
  }, [dialogId, liveMessagesByDialog, localMessagesByDialog, messagesData]);

  useLayoutEffect(() => {
    const local = localMessagesByDialog[dialogId] ?? [];
    const last = local[local.length - 1];
    if (last?.clientId && last.clientId === pendingScrollRef.current) {
      listHandleRef.current?.scrollToBottom("smooth");
      pendingScrollRef.current = null;
    }
  }, [localMessagesByDialog, dialogId, listHandleRef]);

  return { messages, onSendMessage, onDeleteMessage, onEditMessage };
};
