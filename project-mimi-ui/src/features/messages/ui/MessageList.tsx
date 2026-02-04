import { useAppSelector } from "@/app/hooks";
import { UserAvatar } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/features/messages/ui/MessageBubble";
import type { MessageResponseDTO } from "@/shared/api/generated";

type MessageListProps = {
  messages: MessageResponseDTO[]
}

export const MessageList = ({ messages }: MessageListProps) => {
  const currentUserId = useAppSelector((state) => state.auth.userId)

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No messages yet.
      </div>
    )
  }

  return (
    <ul className="space-y-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      {messages.map((message: MessageResponseDTO) => {
        const isMine = currentUserId !== null && message.userId === currentUserId
        return (
          <li
            key={message.id}
            className={cn("flex items-end gap-3", isMine ? "justify-end" : "justify-start")}
          >
            {!isMine && (
              <UserAvatar
                avatarId={message.userAvatarId}
                alt={message.userName}
                className="h-9 w-9"
              />
            )}
            <div
              className={cn(
                "max-w-[70%] space-y-1 flex flex-col",
                isMine ? "items-end text-right" : "items-start"
              )}
            >
              <MessageBubble
                body={message.body}
                createdAt={message.createdAt}
                isEdited={message.isEdited}
                isMine={isMine}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}