import { useEffect, useState, type HTMLAttributes } from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Toast as ToastType } from '@/app/providers/toast'

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  toast: ToastType
  onRemove: (id: string) => void
}

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
}

const colorMap = {
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
  warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
}

const iconColorMap = {
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
}

export const Toast = ({ toast, onRemove, className, ...props }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = iconMap[toast.type]

  useEffect(() => {
    // Show animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300) // Wait for animation to complete
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        colorMap[toast.type],
        className
      )}
      {...props}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorMap[toast.type])} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{toast.title}</div>
        {toast.description && (
          <div className="text-sm opacity-90 mt-1">{toast.description}</div>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

