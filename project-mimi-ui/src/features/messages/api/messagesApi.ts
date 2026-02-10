import { baseApi } from "@/shared/api/baseApi";
import type { DialogReadStateDTO, MessageResponseDTO } from "@/shared/api/generated";

type MarkDialogReadPayload = {
  dialogId: number;
  lastReadMessageId: number;
};

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<MessageResponseDTO[], number>({
      query: (dialogId) => ({
        url: `chat/messages/${dialogId}`,
        method: "GET",
      }),
    }),
    getDialogReadState: builder.query<DialogReadStateDTO, number>({
      query: (dialogId) => ({
        url: `chat/dialogs/${dialogId}/read-state`,
        method: "GET",
      }),
    }),
    markDialogRead: builder.mutation<DialogReadStateDTO, MarkDialogReadPayload>({
      query: ({ dialogId, lastReadMessageId }) => ({
        url: `chat/dialogs/${dialogId}/read`,
        method: "POST",
        body: { lastReadMessageId },
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useGetDialogReadStateQuery, useMarkDialogReadMutation } = messagesApi;
