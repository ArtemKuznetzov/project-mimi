import {Reply, X} from "lucide-react";
import type {ComponentPropsWithoutRef} from "react";
import type {UiMessage} from "@/entities/message";
import {cn} from "@/lib/utils";

interface MessageReplyBlockProps extends ComponentPropsWithoutRef<"div"> {
  message?: UiMessage
  onClose: () => void;
}

export const SelectedMessageBlock = ({message, onClose, className, ...props}: MessageReplyBlockProps) => {
  if (message) {
    return (
      <div
        className={cn(
          "relative rounded-lg border bg-white dark:bg-gray-900 shadow-sm overflow-hidden",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-2 px-4 py-2.5">
          <div className="flex-shrink-0 mt-0.5">
            <Reply className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                {message.action === "reply" ? message.userName : "Edit"}:
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {message.body}
              </p>
            </div>
          </div>
          <button
            className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Отменить ответ"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        </div>
      </div>
  )}

  return null
}