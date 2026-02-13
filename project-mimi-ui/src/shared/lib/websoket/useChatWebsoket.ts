import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import type { MessageResponseDTO } from "@/shared/api/generated";
import { createStompClient } from "@/shared/lib/websoket/client";
import type {MessageAction, MessageCreatePayload, ReadReceiptEvent} from "@/shared/lib/websoket/types";
import type { RootState } from "@/app/store";

type UseWebsoketOptions = {
  dialogId: number;
  onMessage: (message: MessageResponseDTO, action: MessageAction) => void;
  onReadReceipt?: (event: ReadReceiptEvent) => void;
};

export const useChatWebsoket = ({ dialogId, onMessage, onReadReceipt }: UseWebsoketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const messageSubscriptionRef = useRef<StompSubscription | null>(null);
  const readSubscriptionRef = useRef<StompSubscription | null>(null);
  const deleteSubscriptionRef = useRef<StompSubscription | null>(null);
  const updateSubscriptionRef = useRef<StompSubscription | null>(null);

  const onMessageRef = useRef(onMessage);
  const onReadReceiptRef = useRef(onReadReceipt);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onReadReceiptRef.current = onReadReceipt;
  }, [onReadReceipt]);

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
          const payload = JSON.parse(frame.body) as MessageResponseDTO;
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
          const payload = JSON.parse(frame.body) as ReadReceiptEvent;
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
            const payload = JSON.parse(frame.body) as MessageResponseDTO
            onMessageRef.current?.(payload, "delete");
          } catch {
            // ignore invalid payloads
          }
        });

      updateSubscriptionRef.current?.unsubscribe();
      updateSubscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}/update`, (frame: IMessage) => {
        if (!frame.body) {
          return;
        }
        try {
          const payload = JSON.parse(frame.body) as MessageResponseDTO;
          onMessageRef.current?.(payload, "update");
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

      client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [dialogId, accessToken]);

  const sendMessage = useCallback(
    (payload: MessageCreatePayload) => {
      const client = clientRef.current;
      if (!client || !client.connected) {
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
      if (!client || !client.connected) {
        return false;
      }
      client.publish({
        destination: `/app/dialogs/${dialogId}/update/${messageId}`,
        body: JSON.stringify({ body }),
      });
      return true;
    },
    [],
  );

  const sendDeleteMessage = useCallback(
    (dialogId: number, messageId: number) => {
      const client = clientRef.current;
      if (!client || !client.connected) {
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

  return { sendMessage, sendUpdateMessage, sendDeleteMessage, isConnected };
};
