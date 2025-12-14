
import { Toast } from './Toast'
import {useToastContext} from "@/app/providers/toast/ToastContext.ts";

export const Toaster = () => {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

