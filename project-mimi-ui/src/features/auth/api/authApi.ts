import { baseApi } from '@/shared/api/baseApi'
import type { LoginRequestDTO, LoginResponseDTO, TokenValidationResult, UserPublicDTO } from '@/shared/api/generated'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseDTO, LoginRequestDTO>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    validateToken: builder.query<TokenValidationResult, void>({
      query: () => ({
        url: '/auth/validate',
        method: 'GET',
      }),
    }),
    refreshToken: builder.mutation<LoginResponseDTO, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      })
    }),
    getUser: builder.query<UserPublicDTO, { id: number }>({
      query: ({ id }) => ({
        url: `/auth/users/${id}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi

