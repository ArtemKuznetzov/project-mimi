import { baseApi } from "@/shared/api/baseApi";
import type { DialogReadStateDTO, MessageResponseDTO } from "@/shared/api/generated";
import type {MessageCreatePayload} from "@/shared/lib/websoket/types";

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
    sendMessage: builder.mutation<MessageResponseDTO, MessageCreatePayload & {files?: File[]}>({
      query: ({dialogId, body, clientId, replyMessageId, files}) => {
        const formData = new FormData()
        if (body) formData.append("body", body)
        if (replyMessageId) formData.append("replyMessageId", String(replyMessageId))
        if (clientId) formData.append("clientId", clientId)
        if (files?.length) files.forEach(file => formData.append("files", file))

        return {
          url: `chat/messages/${dialogId}/message/send`,
          method: "POST",
          body: formData
        }
      }
    })
  }),
});

export const { useGetMessagesQuery, useGetDialogReadStateQuery, useMarkDialogReadMutation, useSendMessageMutation } = messagesApi;
