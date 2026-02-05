import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import type { MessageResponseDTO } from "@/shared/api/generated";
import { createStompClient } from "@/shared/lib/websoket/client";
import type { MessageCreatePayload } from "@/shared/lib/websoket/types";
import type { RootState } from "@/app/store";

type UseWebsoketOptions = {
  dialogId: number;
  onMessage?: (message: MessageResponseDTO) => void;
};

export const useWebsoket = ({ dialogId, onMessage }: UseWebsoketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

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
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = client.subscribe(`/topic/dialogs/${dialogId}`, (frame: IMessage) => {
        if (!frame.body) {
          return;
        }
        try {
          const payload = JSON.parse(frame.body) as MessageResponseDTO;
          onMessageRef.current?.(payload);
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
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
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

  return { sendMessage, isConnected };
};
