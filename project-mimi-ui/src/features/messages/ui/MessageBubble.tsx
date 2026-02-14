import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/shared/lib/dateUtils";
import type { MessageStatus, UiMessage } from "@/entities/message/model/types";
import { AlertCircle, Check, CheckCheck, Loader2 } from "lucide-react";

type MessageBubbleProps = {
  message: UiMessage;
  isMine: boolean;
  status: MessageStatus | null;
  className?: string;
};

const statusLabels: Record<MessageStatus, string> = {
  failed: "Error",
  pending: "Pending",
  sent: "Sent",
  read: "Read",
};

const getStatusIcon = (status: MessageBubbleProps["status"], isMine: boolean, isDeleted: boolean) => {
  if (!isMine || !status || isDeleted) {
    return null;
  }
  if (status === "failed") {
    return <AlertCircle size={10} className="text-red-500" />;
  }
  if (status === "pending") {
    return <Loader2 size={10} className="animate-spin text-muted-foreground" />;
  }
  if (status === "read") {
    return <CheckCheck size={12} className="text-blue-500" />;
  }
  if (status === "sent") {
    return <Check size={12} className="text-muted-foreground" />;
  }
  return null;
};

export const MessageBubble = ({ message, isMine, status, className }: MessageBubbleProps) => {
  const { body, isEdited, createdAt, replyMessage } = message;
  const isDeleted = Boolean(message.isDeleted);

  const statusIcon = getStatusIcon(status, isMine, isDeleted);

  return (
    <div className={cn("flex min-w-0 max-w-full flex-col gap-1", isMine ? "items-end" : "items-start", className)}>
      <div
        className={cn(
          "inline-flex w-fit max-w-full flex-col rounded-2xl px-3 py-2 text-sm shadow-sm",
          isMine
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100",
          isDeleted ? "bg-gray-200 text-gray-500 italic dark:bg-gray-700 dark:text-gray-300" : null,
        )}
      >
        {!isDeleted && replyMessage ? (
          <div
            className={cn(
              "mb-2 w-full rounded-md border-l-2 px-2 py-1 text-[11px] leading-snug",
              isMine
                ? "border-white/60 bg-white/15 text-white/90"
                : "border-blue-500/60 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
            )}
          >
            <div className="truncate font-medium">{replyMessage.userName}</div>
            <div className="truncate opacity-80">{replyMessage.body}</div>
          </div>
        ) : null}
        {!isDeleted && <p className="whitespace-pre-wrap break-words break-all leading-snug">{body}</p>}
        {isDeleted && <p className="whitespace-pre-wrap break-words break-all leading-snug">Message deleted</p>}
      </div>
      <div className={cn("flex items-center gap-1 text-[10px] leading-none")}>
        <span className="whitespace-nowrap">
          {formatMessageTime(createdAt)}
          {!isDeleted && isEdited ? " • edited" : ""}
        </span>
        {statusIcon ? (
          <span className="inline-flex items-center" title={status ? statusLabels[status] : undefined}>
            {statusIcon}
          </span>
        ) : null}
      </div>
    </div>
  );
};
