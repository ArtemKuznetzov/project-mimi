import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { RootState } from '@/app/store'
import { logout, setAccessToken } from '@/features/auth/model/authSlice'
import type { RefreshTokenResponse } from '@/features/auth/api/authApi'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && 'status' in result.error && result.error.status === 401) {
    try {
      const refreshResult = await fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005',
        credentials: 'include',
      })(
        {
          url: '/refresh',
          method: 'POST',
        },
        api,
        extraOptions
      )
      
      if (refreshResult.data) {
        const { accessToken } = refreshResult.data as RefreshTokenResponse

        if (accessToken && accessToken.trim() !== '') {
          api.dispatch(setAccessToken(accessToken))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout())
        }
      } else {
        api.dispatch(logout())
      }
    } catch {
      api.dispatch(logout())
    }
  }

  if (result.error && 'status' in result.error && result.error.status === 403) {
    api.dispatch(logout())
  }
  
  return result
}

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})

