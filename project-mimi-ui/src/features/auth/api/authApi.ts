import { baseApi } from '@/shared/api/baseApi'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    validateToken: builder.query<void, void>({
      query: () => ({
        url: '/validate',
        method: 'GET',
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST"
      })
    })
  }),
})

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation
} = authApi

