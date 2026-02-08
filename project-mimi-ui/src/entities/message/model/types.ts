import type { MessageResponseDTO } from "@/shared/api/generated";

type LocalStatus = "pending" | "failed";
type BaseMessage = Omit<MessageResponseDTO, "deliveryStatus">;

export interface UiMessage extends BaseMessage {
  clientId?: string;
  localStatus?: LocalStatus;
}