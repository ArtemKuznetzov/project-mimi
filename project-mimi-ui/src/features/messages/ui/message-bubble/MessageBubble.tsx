import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/shared/lib/dateUtils";
import type { MessageStatus, UiMessage } from "@/entities/message/model/types";
import { bubbleShell, getStatusIcon } from "@/features/messages/model";
import { ImagesBlock } from "./ImageBlock";
import { ReplyBlock } from "./ReplyBlock";
import { TextBlock } from "./TextBlock";
import MessageReactions from "../message-reactions/MessageReactions";
import type { MessageListProps } from "../message-list";

type MessageBubbleProps = {
  message: UiMessage;
  isMine: boolean;
  status: MessageStatus | null;
  scrollToMessage: (id: number) => void;
  onToggleReaction?: MessageListProps["messageActions"]["onToggleReaction"];
  className?: string;
};

const statusLabels: Record<MessageStatus, string> = {
  failed: "Error",
  pending: "Pending",
  sent: "Sent",
  read: "Read",
};

export const MessageBubble = ({ message, isMine, status, className, scrollToMessage, onToggleReaction }: MessageBubbleProps) => {
  const { body, isEdited, createdAt, replyMessage, attachments } = message;
  const isDeleted = Boolean(message.isDeleted);

  const trimmedBody = body?.trim() ?? "";
  const hasText = trimmedBody.length > 0;
  const attachmentItems = attachments?.filter((a) => a.objectName) ?? [];
  const hasAttachments = attachmentItems.length > 0;
  const attachmentOnly = !isDeleted && hasAttachments && !hasText;
  const textAndAttachments = !isDeleted && hasText && hasAttachments;

  const statusIcon = getStatusIcon(status, isMine, isDeleted);

  const metaRow = (
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
  );

  return (
    <div
      className={cn("group relative flex min-w-0 max-w-full flex-col gap-1", isMine ? "items-end" : "items-start", className)}
    >
      {attachmentOnly ? (
        <div className="flex w-fit max-w-full min-w-0 flex-col gap-2">
          <ReplyBlock
            isMine={isMine}
            isDeleted={isDeleted}
            replyMessage={replyMessage}
            onClick={scrollToMessage}
          />
          <ImagesBlock
            attachments={attachmentItems}
            textAndAttachments={textAndAttachments}
            attachmentOnly={attachmentOnly}
            isMine={isMine}
          />
        </div>
      ) : textAndAttachments ? (
        <div className={cn(bubbleShell(isMine, isDeleted), "p-0")}>
          {replyMessage && !isDeleted ? (
            <div className="px-3 pt-2">
              <ReplyBlock isMine={isMine} isDeleted={isDeleted} replyMessage={replyMessage} onClick={scrollToMessage} />
            </div>
          ) : null}
          <ImagesBlock
            attachments={attachmentItems}
            textAndAttachments={textAndAttachments}
            attachmentOnly={false}
            isMine={isMine}
            embeddedInBubble
          />
          <div className="px-3 py-2 pt-1.5">
            <TextBlock text={trimmedBody} isDeleted={isDeleted} />
          </div>
        </div>
      ) : (
        <div className={cn("flex w-fit min-w-0 max-w-full flex-col gap-2", isMine ? "items-end" : "items-start")}>
          {(hasText || isDeleted || replyMessage) && (
            <div className="relative">
              <div className={bubbleShell(isMine, isDeleted)}>
                <ReplyBlock isMine={isMine} isDeleted={isDeleted} replyMessage={replyMessage} onClick={scrollToMessage} />
                <TextBlock text={trimmedBody} isDeleted={isDeleted} />
                {isDeleted && <p className="whitespace-pre-wrap break-words break-all leading-snug">Message deleted</p>}
                {!isDeleted && (
                  <MessageReactions
                    isMine={isMine}
                    reactions={message.messageReactions}
                    onToggleReaction={onToggleReaction}
                    messageId={message.id}
                  />
                )}
              </div>
            </div>
          )}
          {!isDeleted && hasAttachments && (
            <ImagesBlock
              attachments={attachmentItems}
              textAndAttachments={textAndAttachments}
              attachmentOnly={attachmentOnly}
              isMine={isMine}
            />
          )}
        </div>
      )}
      {metaRow}
    </div>
  );
};
