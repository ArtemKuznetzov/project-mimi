export type MessageCreatePayload = {
    body: string;
    clientId?: string;
};

export type ReadReceiptEvent = {
    dialogId: number;
    userId: number;
    lastReadMessageId: number;
    readAt?: string | null;
};

export type MessageAction = "send" | "update" | "delete";
