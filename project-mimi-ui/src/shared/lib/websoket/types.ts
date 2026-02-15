export type MessageCreatePayload = {
    body: string;
    clientId?: string;
    replyMessageId?: number;
};

export type ReadReceiptEvent = {
    dialogId: number;
    userId: number;
    lastReadMessageId: number;
    readAt?: string | null;
};

export type MessageAction = "send" | "edit" | "delete" | "reply";
