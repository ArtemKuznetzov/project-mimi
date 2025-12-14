import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

