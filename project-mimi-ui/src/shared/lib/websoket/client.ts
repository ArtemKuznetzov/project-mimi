import { Client } from "@stomp/stompjs";
import { apiBaseUrl } from "@/shared/config/api";

const getWebSocketBaseUrl = (baseUrl: string) => {
  try {
    const url = new URL(baseUrl);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}`;
  } catch {
    return baseUrl.replace(/^http/, "ws");
  }
};

export const chatWebSocketUrl = `${getWebSocketBaseUrl(apiBaseUrl)}/chat/ws`;

export const createStompClient = () =>
  new Client({
    brokerURL: chatWebSocketUrl,
    reconnectDelay: 5000,
  });