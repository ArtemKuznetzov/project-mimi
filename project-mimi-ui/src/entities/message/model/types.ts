import type { MessageResponseDTO } from "@/shared/api/generated";
import type {MessageAction} from "@/shared/lib/websoket/types";

export type MessageStatus = "pending" | "failed" | "sent" | "read";
type LocalStatus = "pending" | "failed";
type BaseMessage = Omit<MessageResponseDTO, "deliveryStatus">;

export interface UiMessage extends BaseMessage {
  clientId?: string;
  localStatus?: LocalStatus;
  action?: MessageAction
}