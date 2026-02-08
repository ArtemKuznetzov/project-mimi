import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/shared/lib/dateUtils";
import type { UiMessage } from "@/entities/message";
import { AlertCircle, Loader2 } from "lucide-react";

type MessageBubbleProps = {
  message: UiMessage;
  isMine?: boolean;
  className?: string;
};

export const MessageBubble = ({ message, isMine, className }: MessageBubbleProps) => {
  const { body, isEdited, createdAt, localStatus } = message;

  const getStatusIcon = () => {
    if (!isMine) {
      return null;
    }
    if (localStatus === "failed") {
      return <AlertCircle size={10} className="text-red-500" />;
    }
    if (localStatus === "pending") {
      return <Loader2 size={10} className="animate-spin text-muted-foreground" />;
    }
    return null;
  };

  const statusIcon = getStatusIcon();

  return (
    <div className={cn("flex min-w-0 max-w-full flex-col gap-1", isMine ? "items-end" : "items-start", className)}>
      <div
        className={cn(
          "min-w-0 max-w-full rounded-2xl px-3 py-2 text-sm shadow-sm",
          isMine
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100",
        )}
      >
        <p className="min-w-10 whitespace-pre-wrap break-words break-all leading-snug">{body}</p>
      </div>
      <div className={cn("flex items-center gap-1 text-[10px] leading-none")}>
        <span className="whitespace-nowrap">
          {formatMessageTime(createdAt)}
          {isEdited ? " • edited" : ""}
        </span>
        {statusIcon ? <span className="inline-flex items-center">{statusIcon}</span> : null}
      </div>
    </div>
  );
};
