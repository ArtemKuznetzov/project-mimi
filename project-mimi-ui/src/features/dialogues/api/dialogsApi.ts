import { baseApi } from "@/shared/api/baseApi.ts";
import type { DialogResponseDTO } from "@/shared/api/generated";

export const dialogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDialogs: builder.query<DialogResponseDTO[], void>({
      query: () => ({
        url: "/chat/dialogs",
        method: "GET"
      })
    })
  })
})

export const {
  useGetDialogsQuery
} = dialogsApi