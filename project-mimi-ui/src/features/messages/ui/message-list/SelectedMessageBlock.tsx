import { Reply, X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import type { UiMessage } from "@/entities/message";
import { cn } from "@/lib/utils";

interface MessageReplyBlockProps extends ComponentPropsWithoutRef<"div"> {
  message?: UiMessage;
  onClose: () => void;
}

export const SelectedMessageBlock = ({ message, onClose, className, ...props }: MessageReplyBlockProps) => {
  if (message) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-900", className)}
        {...props}
      >
        <div className="flex items-start gap-2 px-4 py-2.5">
          <div className="mt-0.5 flex-shrink-0">
            <Reply className="h-4 w-4 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="flex-shrink-0 text-sm font-medium text-blue-600 dark:text-blue-400">
                {message.action === "reply" ? message.userName : "Edit"}:
              </span>
              <p className="truncate text-sm text-gray-600 dark:text-gray-300">{message.body}</p>
            </div>
          </div>
          <button
            className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Cancel answer"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
