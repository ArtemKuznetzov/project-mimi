import type { RefObject } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MessageReactionDTO, MessageReactionResponseDTO, MessageResponseDTO } from "@/shared/api/generated";
import { useChatWebsoket } from "@/shared/lib/websoket/useChatWebsoket";
import type { MessageAction, MessageCreatePayload, ReadReceiptEvent } from "@/shared/lib/websoket/types";
import type { UiMessage } from "@/entities/message";
import type { MessageListHandle } from "@/features/messages/ui";
import { useSendMessageMutation } from "@/features/messages/api/messagesApi";

type UseDialogMessagesStateOptions = {
  dialogId: number;
  messagesData: MessageResponseDTO[];
  currentUserId: number | null;
  listHandleRef: RefObject<MessageListHandle | null>;
  onReadReceipt?: (event: ReadReceiptEvent) => void;
};

type UseDialogMessagesStateResult = {
  messages: UiMessage[];
  onSendMessage: (payload: MessageCreatePayload, replyMessage?: UiMessage) => Promise<boolean>;
  onDeleteMessage: (messageId: number) => boolean;
  onEditMessage: (messageId: number, body: string) => boolean;
  onToggleReaction: (messageId: number, reaction: MessageReactionDTO) => boolean;
};

/**

* Naming convention:
*
* `handle...` — process data received from WebSocket events.
* `on...` — handle user actions that send data to WebSocket (e.g., sending a message, marking a message as read, etc.).
  */
export const useDialogMessagesState = ({
  dialogId,
  messagesData,
  currentUserId,
  listHandleRef,
  onReadReceipt
}: UseDialogMessagesStateOptions): UseDialogMessagesStateResult => {
  const [liveMessagesByDialog, setLiveMessagesByDialog] = useState<Record<number, UiMessage[]>>({});
  const [localMessagesByDialog, setLocalMessagesByDialog] = useState<Record<number, UiMessage[]>>({});
  
  const pendingScrollRef = useRef<string | null>(null);

  const [sendMessage] = useSendMessageMutation()

  const handleMessage = useCallback(
    (message: MessageResponseDTO, action: MessageAction) => {
      setLiveMessagesByDialog((prev) => {
        const current = prev[dialogId] ?? [];
        const existsInLive = current.some((item) => item.id === message.id);
        const existsInInitial = messagesData.some((item) => item.id === message.id);
        if (action !== "send") {
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

  const handleReaction = useCallback((reactions: MessageReactionResponseDTO) => {
    if (reactions.reactions.length === 0) {
      return;
    }
    setLiveMessagesByDialog((prev) => {
      const messages = prev[dialogId] ?? [];
      const currentMessage = messages.find((msg) => msg.id === reactions.messageId);
      if (!currentMessage) {
        return prev;
      }
      return {
        ...prev,
        [dialogId]: messages.map((msg) => (msg.id === reactions.messageId ? { ...msg, reactions: reactions.reactions } : msg)),
      };
    });
  }, [dialogId]);

  const { sendUpdateMessage, sendDeleteMessage, sendToggleReaction } = useChatWebsoket({
    dialogId,
    onMessage: handleMessage,
    handleReaction,
    onReadReceipt,
  });

  const onSendMessage: UseDialogMessagesStateResult['onSendMessage'] = useCallback(
    async (payload, replyMessage) => {
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

      try {
        const saved = await sendMessage({ ...payload, replyMessageId: replyMessage?.id, clientId, dialogId }).unwrap();
        if (saved) {
          handleMessage(saved, "send");
        }
        return true;
      } catch {
        setLocalMessagesByDialog((prev) => ({
          ...prev,
          [dialogId]: (prev[dialogId] ?? []).map((message) =>
            message.clientId === clientId ? { ...message, localStatus: "failed" } : message,
          ),
        }));
        return false;
      }
    },
    [dialogId, currentUserId, sendMessage, handleMessage],
  );

  const onDeleteMessage = useCallback(
    (messageId: number) => {
      if (!Number.isFinite(dialogId) || !Number.isFinite(messageId) || currentUserId === null) {
        return false;
      }

      return sendDeleteMessage(dialogId, messageId);
    },
    [currentUserId, dialogId, sendDeleteMessage],
  );

  const onEditMessage = useCallback(
    (messageId: number, body: string)=> {
      if (!Number.isFinite(dialogId) || !Number.isFinite(messageId) || currentUserId === null) {
        return false;
      }

      return sendUpdateMessage(dialogId, messageId, body);
    }, [dialogId, currentUserId, sendUpdateMessage]
  )

  const messages = useMemo(() => {
    const liveMessages = liveMessagesByDialog[dialogId] ?? [];
    const localMessages = localMessagesByDialog[dialogId] ?? [];

    const messageMap = new Map<number, UiMessage>();
    for (const msg of messagesData as UiMessage[]) {
      messageMap.set(msg.id, msg);
    }
    for (const msg of liveMessages) {
      messageMap.set(msg.id, msg);
    }

    const merged = Array.from(messageMap.values());

    const serverClientIds = new Set<string>();
    for (const msg of merged) {
      if (msg.clientId) serverClientIds.add(msg.clientId);
    }
    const filteredLocal = localMessages.filter(
      (msg) => !msg.clientId || !serverClientIds.has(msg.clientId)
    );

    return [...merged, ...filteredLocal].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [dialogId, liveMessagesByDialog, localMessagesByDialog, messagesData]);

  useLayoutEffect(() => {
    const local = localMessagesByDialog[dialogId] ?? [];
    const last = local[local.length - 1];
    if (last?.clientId && last.clientId === pendingScrollRef.current) {
      listHandleRef.current?.scrollToBottom("smooth");
      pendingScrollRef.current = null;
    }
  }, [localMessagesByDialog, dialogId, listHandleRef]);

  const onToggleReaction = useCallback(
    (messageId: number, reaction: MessageReactionDTO) => {
      if (!Number.isFinite(dialogId) || !Number.isFinite(messageId) || currentUserId === null) {
        return false;
      }
      return sendToggleReaction(dialogId, messageId, reaction);
    }, [dialogId, currentUserId, sendToggleReaction]
  );

  return { messages, onSendMessage, onDeleteMessage, onEditMessage, onToggleReaction };
};
