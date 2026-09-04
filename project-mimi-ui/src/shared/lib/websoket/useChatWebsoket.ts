import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import type { MessageReactionDTO, MessageReactionResponseDTO, MessageResponseDTO } from "@/shared/api/generated";
import { createStompClient } from "@/shared/lib/websoket/client";
import type {MessageAction, MessageCreatePayload, ReadReceiptEvent} from "@/shared/lib/websoket/types";
import type { RootState } from "@/app/store";

type UseWebsoketOptions = {
  dialogId: number;
  onMessage: (message: MessageResponseDTO, action: MessageAction) => void;
  onReadReceipt?: (event: ReadReceiptEvent) => void;
  handleReaction?: (reaction: MessageReactionResponseDTO) => void
};

export const useChatWebsoket = ({ dialogId, onMessage, onReadReceipt, handleReaction }: UseWebsoketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const messageSubscriptionRef = useRef<StompSubscription | null>(null);
  const readSubscriptionRef = useRef<StompSubscription | null>(null);
  const deleteSubscriptionRef = useRef<StompSubscription | null>(null);
  const updateSubscriptionRef = useRef<StompSubscription | null>(null);
  const toggleReactionSubscriptionRef = useRef<StompSubscription | null>(null);

  const onMessageRef = useRef(onMessage);
  const onReadReceiptRef = useRef(onReadReceipt);
  const handleReactionRef = useRef(handleReaction)

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onReadReceiptRef.current = onReadReceipt;
  }, [onReadReceipt]);

  useEffect(() => {
    handleReactionRef.current = handleReaction
  }, [handleReaction])

  useEffect(() => {
    if (!Number.isFinite(dialogId)) {
      return;
    }

    if (!accessToken) {
      console.warn("Cannot connect to WebSocket without access token");
      return;
    }

    const client = createStompClient(accessToken);
    clientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);

      messageSubscriptionRef.current?.unsubscribe();
      messageSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}`, (frame: IMessage) => {
        if (!frame.body) {
          return;
        }
        try {
          const payload = JSON.parse(frame.body) satisfies MessageResponseDTO;
          onMessageRef.current?.(payload, "send");
        } catch {
          // ignore invalid payloads
        }
      });

      readSubscriptionRef.current?.unsubscribe();
      readSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}/read`, (frame: IMessage) => {
        if (!frame.body) {
          return;
        }
        try {
          const payload = JSON.parse(frame.body) satisfies ReadReceiptEvent;
          onReadReceiptRef.current?.(payload);
        } catch {
          // ignore invalid payloads
        }
      })

        deleteSubscriptionRef.current?.unsubscribe();
        deleteSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}/delete`, (frame: IMessage) => {
          if (!frame.body) {
            return;
          }
          try {
            const payload = JSON.parse(frame.body) satisfies MessageResponseDTO
            onMessageRef.current?.(payload, "delete");
          } catch {
            // ignore invalid payloads
          }
        });

      updateSubscriptionRef.current?.unsubscribe();
      updateSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}/edit`, (frame: IMessage) => {
        if (!frame.body) {
          return;
        }
        try {
          const payload = JSON.parse(frame.body) satisfies MessageResponseDTO;
          onMessageRef.current?.(payload, "edit");
        } catch {
          // ignore invalid payloads
        }
      });

    toggleReactionSubscriptionRef.current?.unsubscribe();
    toggleReactionSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}/add-reaction`, (frame: IMessage) => {
      if (!frame.body) {
        return;
      }
      try {
        const payload = JSON.parse(frame.body) satisfies MessageReactionResponseDTO;
        handleReactionRef.current?.(payload);
      } catch {
        // ignore invalid payloads
      }
    });
  };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("WebSocket STOMP error:", frame);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.onWebSocketError = (event) => {
      console.error("WebSocket error:", event);
      setIsConnected(false);
    };

    client.activate();

    return () => {
      messageSubscriptionRef.current?.unsubscribe();
      messageSubscriptionRef.current = null;
      readSubscriptionRef.current?.unsubscribe();
      readSubscriptionRef.current = null;
      toggleReactionSubscriptionRef.current?.unsubscribe()
      toggleReactionSubscriptionRef.current = null

      client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [dialogId, accessToken]);

  const sendMessage = useCallback(
    (payload: MessageCreatePayload) => {
      const client = clientRef.current;
      if (!client?.connected) {
        return false;
      }
      client.publish({
        destination: `/app/dialogs/${dialogId}/send`,
        body: JSON.stringify(payload),
      });
      return true;
    },
    [dialogId],
  );

  const sendUpdateMessage = useCallback(
    (dialogId: number, messageId: number, body: string) => {
      const client = clientRef.current;
      if (!client?.connected) {
        return false;
      }
      client.publish({
        destination: `/app/dialogs/${dialogId}/edit/${messageId}`,
        body: JSON.stringify({ body }),
      });
      return true;
    },
    [],
  );

  const sendDeleteMessage = useCallback(
    (dialogId: number, messageId: number) => {
      const client = clientRef.current;
      if (!client?.connected) {
        return false;
      }
      client.publish({
        destination: `/app/dialogs/${dialogId}/delete/${messageId}`,
        body: JSON.stringify({}),
      });
      return true;
    },
    [],
  )

  const sendToggleReaction = useCallback(
    (dialogId: number, messageId: number, reaction: MessageReactionDTO) => {
      const client = clientRef.current;
      if (!client?.connected) {
        return false
      }
      client.publish({
        destination: `/app/dialogs/${dialogId}/add-reaction/${messageId}`,
        body: JSON.stringify(reaction)
      })
      return true
  }, []);

  return { sendMessage, sendUpdateMessage, sendDeleteMessage, sendToggleReaction, isConnected };
};
