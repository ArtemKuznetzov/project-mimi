import { useState, useRef, type ReactNode } from 'react'
import type { Toast } from './ToastContext'
import { ToastContext } from './ToastContext'

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }
    
    setToasts((prev) => [...prev, newToast])

    // Automatically remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, newToast.duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

