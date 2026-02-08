import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { MessageResponseDTO } from "@/shared/api/generated";
import { useChatWebsoket } from "@/shared/lib/websoket/useChatWebsoket";
import type { MessageCreatePayload } from "@/shared/lib/websoket/types";
import type { UiMessage } from "@/entities/message";
import type { MessageListHandle } from "@/features/messages/ui/MessageList";

type UseDialogMessagesStateOptions = {
  dialogId: number;
  messagesData: MessageResponseDTO[];
  currentUserId: number | null;
  listHandleRef: RefObject<MessageListHandle | null>;
};

type UseDialogMessagesStateResult = {
  messages: UiMessage[];
  onSendMessage: (payload: MessageCreatePayload) => boolean;
};

export const useDialogMessagesState = ({
  dialogId,
  messagesData,
  currentUserId,
  listHandleRef,
}: UseDialogMessagesStateOptions): UseDialogMessagesStateResult => {
  const [liveMessagesByDialog, setLiveMessagesByDialog] = useState<Record<number, UiMessage[]>>({});
  const [localMessagesByDialog, setLocalMessagesByDialog] = useState<Record<number, UiMessage[]>>({});

  const pendingScrollRef = useRef<string | null>(null);

  const handleMessage = useCallback(
    (message: MessageResponseDTO) => {
      setLiveMessagesByDialog((prev) => {
        const current = prev[dialogId] ?? [];
        const existsInLive = current.some((item) => item.id === message.id);
        const existsInInitial = messagesData.some((item) => item.id === message.id);
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

      if (currentUserId !== null && message.userId === currentUserId) {
        requestAnimationFrame(() => listHandleRef.current?.scrollToBottom("smooth"));
      }
    },
    [dialogId, messagesData, currentUserId, listHandleRef],
  );

  const { sendMessage } = useChatWebsoket({
    dialogId,
    onMessage: handleMessage,
  });

  const onSendMessage = useCallback(
    (payload: MessageCreatePayload) => {
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
        localStatus: "pending",
      };
      setLocalMessagesByDialog((prev) => ({
        ...prev,
        [dialogId]: [...(prev[dialogId] ?? []), optimisticMessage],
      }));

      const isSent = sendMessage({ ...payload, clientId });
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

  return { messages, onSendMessage };
};
