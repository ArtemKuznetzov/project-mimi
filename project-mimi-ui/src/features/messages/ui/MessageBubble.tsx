import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/shared/lib/dateUtils";

type MessageBubbleProps = {
  body: string;
  createdAt: string;
  isEdited?: boolean;
  isMine?: boolean;
  userName?: string;
  className?: string;
};

export const MessageBubble = ({
  body,
  createdAt,
  isEdited,
  isMine,
  userName,
  className,
}: MessageBubbleProps) => (
  <div
    className={cn(
      "relative rounded-2xl px-3 pb-5 pt-2 text-sm shadow-sm",
      isMine
        ? "bg-blue-500 text-white rounded-br-sm"
        : "bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100",
      className
    )}
  >
    {userName && !isMine ? (
      <div className="mb-1 text-xs font-medium text-blue-100/90">
        {userName}
      </div>
    ) : null}
    <p className="whitespace-pre-wrap break-words">{body}</p>
    <span
      className={cn(
        "absolute bottom-1 right-2 text-[10px]",
        isMine ? "text-blue-100/90" : "text-muted-foreground"
      )}
    >
      {formatMessageTime(createdAt)}
      {isEdited ? " • edited" : ""}
    </span>
  </div>
);
