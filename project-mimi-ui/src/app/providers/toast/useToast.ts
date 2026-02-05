import { useToastContext, type ToastType } from "./ToastContext";

interface ShowToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const { addToast } = useToastContext();

  return {
    success: (options: ShowToastOptions) => {
      addToast({ type: "success", ...options });
    },
    warning: (options: ShowToastOptions) => {
      addToast({ type: "warning", ...options });
    },
    error: (options: ShowToastOptions) => {
      addToast({ type: "error", ...options });
    },
    show: (type: ToastType, options: ShowToastOptions) => {
      addToast({ type, ...options });
    },
  };
};
