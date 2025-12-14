import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useRefreshTokenMutation } from '../api/authApi'
import { logout, setAccessToken } from '@/features/auth'

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const [isInitialized, setIsInitialized] = useState(false)
  const [refreshTokenMutation] = useRefreshTokenMutation()
  const hasRestored = useRef(false)

  useEffect(() => {
    // Prevent two similar requests
    if (hasRestored.current) {
      return
    }

    const restoreSession = async () => {
      if (accessToken) {
        setIsInitialized(true)
        hasRestored.current = true
        return
      }

      hasRestored.current = true

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

