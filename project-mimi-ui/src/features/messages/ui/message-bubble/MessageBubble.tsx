import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/shared/lib/dateUtils";
import type { MessageStatus, UiMessage } from "@/entities/message/model/types";
import { bubbleShell, getStatusIcon } from "@/features/messages/model";
import { ImagesBlock } from "./ImageBlock";
import { ReplyBlock } from "./ReplyBlock";
import { TextBlock } from "./TextBlock";

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

export const MessageBubble = ({ message, isMine, status, className }: MessageBubbleProps) => {
  const { body, isEdited, createdAt, replyMessage, attachments } = message;
  const isDeleted = Boolean(message.isDeleted);

  const trimmedBody = body?.trim() ?? "";
  const hasText = trimmedBody.length > 0;
  const attachmentItems = attachments?.filter((a) => a.objectName) ?? [];
  const hasAttachments = attachmentItems.length > 0;
  const attachmentOnly = !isDeleted && hasAttachments && !hasText;
  const textAndAttachments = !isDeleted && hasText && hasAttachments;

  const statusIcon = getStatusIcon(status, isMine, isDeleted);

  return (
    <div className={cn("flex min-w-0 max-w-full flex-col gap-1", isMine ? "items-end" : "items-start", className)}>
      {attachmentOnly ? (
        <div className="flex w-fit max-w-full min-w-0 flex-col gap-2">
          <ReplyBlock isMine={isMine} isDeleted={isDeleted} replyMessage={replyMessage} />
          <ImagesBlock
            attachments={attachmentItems}
            textAndAttachments={textAndAttachments}
            attachmentOnly={attachmentOnly}
            isMine={isMine}
          />
        </div>
      ) : (
        <div className={cn("flex w-fit min-w-0 max-w-full flex-col gap-2", isMine ? "items-end" : "items-start")}>
          {(hasText || isDeleted || replyMessage) && (
            <div className={bubbleShell(isMine, isDeleted)}>
              <ReplyBlock isMine={isMine} isDeleted={isDeleted} replyMessage={replyMessage} />
              <TextBlock text={trimmedBody} isDeleted={isDeleted} />
              {isDeleted && <p className="whitespace-pre-wrap break-words break-all leading-snug">Message deleted</p>}
            </div>
          )}
          {!isDeleted && (
            <ImagesBlock
              attachments={attachmentItems}
              textAndAttachments={textAndAttachments}
              attachmentOnly={attachmentOnly}
              isMine={isMine}
            />
          )}
        </div>
      )}
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
