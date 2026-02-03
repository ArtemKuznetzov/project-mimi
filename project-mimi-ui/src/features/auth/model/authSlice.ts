import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {decodeJwt} from "@/shared/lib/authUtils";

type JwtPayload = {
  user_id: string
}

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  userId: number | null
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  userId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuthenticated = true
      state.userId = Number(decodeJwt<JwtPayload>(action.payload)?.user_id)
    },
    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
    },
  },
})

export const { setAccessToken, logout } = authSlice.actions
export default authSlice.reducer

