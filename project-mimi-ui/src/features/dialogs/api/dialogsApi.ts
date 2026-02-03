import { baseApi } from "@/shared/api/baseApi";
import type { DialogResponseDTO } from "@/shared/api/generated";

export const dialogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDialogs: builder.query<DialogResponseDTO[], void>({
      query: () => ({
        url: "/chat/dialogs",
        method: "GET"
      })
    }),
    getDialogById: builder.query<DialogResponseDTO, number>({
      query: (id) => ({
        url: `/chat/dialogs/${id}`,
        method: "GET"
      })
    })
  })
})

export const {
  useGetDialogsQuery,
  useGetDialogByIdQuery
} = dialogsApi