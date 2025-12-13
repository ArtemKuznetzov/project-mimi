import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useRefreshTokenMutation } from '../api/authApi'
import { logout, setAccessToken } from '@/features/auth'

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const [isInitialized, setIsInitialized] = useState(false)
  const [refreshTokenMutation] = useRefreshTokenMutation()

  useEffect(() => {
    const restoreSession = async () => {
      if (accessToken) {
        setIsInitialized(true)
        return
      }

      try {
        const result = await refreshTokenMutation().unwrap()
        
        if (result.accessToken && typeof result.accessToken === 'string' && result.accessToken.trim() !== '') {
          dispatch(setAccessToken(result.accessToken))
        } else {
          dispatch(logout())
        }
      } catch {
        dispatch(logout())
      } finally {
        setIsInitialized(true)
      }
    }

    void restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isInitialized) {
    return null
  }

  return <>{children}</>
}

