export type MessageCreatePayload = {
    body: string;
    dialogId?: number;
    clientId?: string;
    replyMessageId?: number;
    files?: File[];
};

export type ReadReceiptEvent = {
    dialogId: number;
    userId: number;
    lastReadMessageId: number;
    readAt?: string | null;
};

export type MessageAction = "send" | "edit" | "delete" | "reply";
