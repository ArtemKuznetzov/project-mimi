import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { useAppSelector } from "@/app/hooks";
import { UserAvatar } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/features/messages/ui/MessageBubble";
import type { UiMessage } from "@/entities/message";

const dialogScrollPositions = new Map<number, number>();

export type MessageListHandle = {
  scrollToBottom: (behavior: ScrollBehavior) => void;
  isNearBottom: (threshold: number) => boolean;
};

type MessageListProps = {
  messages: UiMessage[];
  dialogId: number;
};

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  ({ messages, dialogId }: MessageListProps, ref) => {
    const currentUserId = useAppSelector((state) => state.auth.userId);
    const listRef = useRef<HTMLUListElement | null>(null);
    const lastDialogIdRef = useRef<number | null>(null);
    const shouldRestoreRef = useRef(false);

    const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
      const list = listRef.current;
      if (!list) {
        return;
      }
      list.scrollTo({ behavior, top: list.scrollHeight });
    };

    const isNearBottom = (threshold: number = 40) => {
      const list = listRef.current;
      if (!list) {
        return false;
      }
      return list.scrollHeight - list.scrollTop - list.clientHeight < threshold;
    };

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom,
        isNearBottom,
      }),
      [],
    );

    useLayoutEffect(() => {
      if (!Number.isFinite(dialogId)) {
        return;
      }
      if (lastDialogIdRef.current !== dialogId) {
        lastDialogIdRef.current = dialogId;
        shouldRestoreRef.current = true;
      }
    }, [dialogId]);

    useLayoutEffect(() => {
      if (!shouldRestoreRef.current || !Number.isFinite(dialogId)) {
        return;
      }
      const list = listRef.current;
      if (!list) {
        return;
      }
      const savedScrollTop = dialogScrollPositions.get(dialogId);
      if (savedScrollTop !== undefined) {
        list.scrollTop = savedScrollTop;
      } else {
        list.scrollTop = list.scrollHeight;
      }
      shouldRestoreRef.current = false;
    }, [dialogId, messages.length]);

    const handleScroll = () => {
      if (!Number.isFinite(dialogId)) {
        return;
      }
      const list = listRef.current;
      if (!list) {
        return;
      }
      dialogScrollPositions.set(dialogId, list.scrollTop);
    };

    if (messages.length === 0) {
      return <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No messages yet.</div>;
    }

    return (
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="scrollbar max-h-[60vh] overflow-y-auto space-y-4 rounded-lg border bg-white p-4 pr-2 shadow-sm dark:bg-gray-900"
      >
        {messages.map((message: UiMessage) => {
          const isMine = currentUserId !== null && message.userId === currentUserId;
          return (
            <li
              key={message.id}
              className={cn("flex items-end gap-3", isMine ? "justify-end" : "justify-start")}
            >
              {!isMine && <UserAvatar avatarId={message.userAvatarId} alt={message.userName} className="h-9 w-9" />}
              <div className={cn("max-w-[70%] min-w-0 space-y-1 flex flex-col", isMine ? "items-end" : "items-start")}>
                <MessageBubble message={message} isMine={isMine} />
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);
