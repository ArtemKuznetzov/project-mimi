import { baseApi } from "@/shared/api/baseApi";
import type { MessageResponseDTO } from "@/shared/api/generated";

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<MessageResponseDTO[], number>({
      query: (dialogId) => ({
        url: `chat/messages/${dialogId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
