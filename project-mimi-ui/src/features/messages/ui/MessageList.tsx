import {forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useAppSelector } from "@/app/hooks";
import { UserAvatar } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/features/messages/ui/MessageBubble";
import type { MessageStatus, UiMessage } from "@/entities/message/model/types";
import {MessageActions} from "@/features/messages/ui/MessageActions";
import {MessageReplyBlock} from "@/features/messages/ui/MessageReplyBlock";

const dialogScrollPositions = new Map<number, number>();
const REPLY_BLOCK_HEIGHT = 44;

export type MessageListHandle = {
  scrollToBottom: (behavior: ScrollBehavior) => void;
  isNearBottom: (threshold: number) => boolean;
};

type MenuState = {
  message: UiMessage;
  x: number;
  y: number;
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export type MessageListProps = {
  messages: UiMessage[];
  dialogId: number;
  otherLastReadMessageId: number | null;
  messageActions: {
    onReadCandidate: (messageId: number) => void;
    onDeleteMessage: (messageId: number) => void;
    onEditMessage: (message: UiMessage) => void;
    onReplyMessage: (message: UiMessage) => void;
  }
  replyMessage?: UiMessage;
  onCloseReply: () => void;
};

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  ({
    messages,
    dialogId,
    otherLastReadMessageId,
    messageActions,
    replyMessage,
    onCloseReply,
  }: MessageListProps, ref) => {
    const currentUserId = useAppSelector((state) => state.auth.userId);
    const listRef = useRef<HTMLUListElement | null>(null);
    const lastDialogIdRef = useRef<number | null>(null);
    const shouldRestoreRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const visibleIdsRef = useRef<Set<number>>(new Set());
    const maxReportedRef = useRef(0);
    const [menuState, setMenuState] = useState<MenuState | null>(null);

    const {onReplyMessage, onEditMessage, onDeleteMessage, onReadCandidate} = messageActions

    const handleContextMenu = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>, message: UiMessage, isMine: boolean) => {
        event.preventDefault();
        if (message.isDeleted) {
          return;
        }
        setMenuState({
          message,
          x: event.clientX,
          y: event.clientY,
          canReply: !message.isDeleted,
          canEdit: isMine && !message.isDeleted,
          canDelete: isMine && !message.isDeleted,
        });
      },
      [],
    );

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

    // Check is dialog changed
    useLayoutEffect(() => {
      if (!Number.isFinite(dialogId)) {
        return;
      }
      if (lastDialogIdRef.current !== dialogId) {
        lastDialogIdRef.current = dialogId;
        shouldRestoreRef.current = true;
      }
    }, [dialogId]);

    // Restore scroll position
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

    useLayoutEffect(() => {
      const list = listRef.current

      if (list) {
        const wasNearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < REPLY_BLOCK_HEIGHT * 2;
        if (replyMessage && wasNearBottom) {
          requestAnimationFrame(() => scrollToBottom("auto"));
        }
      }
    }, [replyMessage]);

    // Reset msg counter
    useEffect(() => {
      maxReportedRef.current = 0;
    }, [dialogId]);

    useEffect(() => {
      if (!onReadCandidate || currentUserId === null) {
        return;
      }
      const list = listRef.current;
      if (!list) {
        return;
      }

      observerRef.current?.disconnect();
      visibleIdsRef.current.clear();

      const observer = new IntersectionObserver(
        (entries) => {
          let changed = false;
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            const id = Number(target.dataset.messageId);
            if (!Number.isFinite(id) || id <= 0) {
              continue;
            }
            if (entry.isIntersecting) {
              if (!visibleIdsRef.current.has(id)) {
                visibleIdsRef.current.add(id);
                changed = true;
              }
            } else if (visibleIdsRef.current.delete(id)) {
              changed = true;
            }
          }
          if (!changed) {
            return;
          }
          let maxVisible = 0;
          for (const id of visibleIdsRef.current) {
            if (id > maxVisible) {
              maxVisible = id;
            }
          }
          if (maxVisible > maxReportedRef.current) {
            maxReportedRef.current = maxVisible;
            onReadCandidate(maxVisible);
          }
        },
        {
          root: list,
          threshold: 0.6,
        },
      );

      observerRef.current = observer;

      const items = list.querySelectorAll<HTMLElement>("[data-read-observe='true']");
      for (const item of items) {
        observer.observe(item);
      }

      return () => {
        observer.disconnect();
        observerRef.current = null;
      };
    }, [messages, dialogId, currentUserId, onReadCandidate]);

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

    const readBoundary = otherLastReadMessageId ?? 0;

    return (
      <div className="relative rounded-lg border bg-white shadow-sm dark:bg-gray-900">
        <ul
          ref={listRef}
          onScroll={handleScroll}
          className={cn(
            "scrollbar max-h-[60vh] overflow-y-auto space-y-4 p-4 pr-2",
            Boolean(replyMessage) && "pb-20",
          )}
        >
          {messages.map((message: UiMessage) => {
            const isMine = currentUserId !== null && message.userId === currentUserId;
            const shouldObserve = !isMine && message.id > 0;
            const status: MessageStatus | null = isMine
              ? message.localStatus === "failed"
                ? "failed"
                : message.localStatus === "pending"
                  ? "pending"
                  : message.id > 0 && message.id <= readBoundary
                    ? "read"
                    : "sent"
              : null;
            return (
              <li
                key={message.id}
                data-message-id={message.id}
                data-read-observe={shouldObserve ? "true" : undefined}
                className={cn("flex items-end gap-3", isMine ? "justify-end" : "justify-start")}
              >
                {!isMine && <UserAvatar avatarId={message.userAvatarId} alt={message.userName} className="h-9 w-9" />}
                <div
                  className={cn("max-w-[70%] min-w-[min(200px,30vw)] space-y-1 flex flex-col", isMine ? "items-end" : "items-start")}
                  onContextMenu={(event) => handleContextMenu(event, message, isMine)}
                >
                  <MessageBubble message={message} isMine={isMine} status={status} />
                </div>
              </li>
            );
          })}
          {menuState ? (
            <MessageActions
              x={menuState.x}
              y={menuState.y}
              canReply={menuState.canReply}
              canEdit={menuState.canEdit}
              canDelete={menuState.canDelete}
              onClose={() => setMenuState(null)}
              onDelete={() => onDeleteMessage(menuState.message.id)}
              onEdit={() => onEditMessage(menuState.message)}
              onReply={() => onReplyMessage(menuState.message)}
            />
          ) : null}
        </ul>
        {replyMessage ? (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <MessageReplyBlock message={replyMessage} onClose={onCloseReply} />
          </div>
        ) : null}
      </div>
    );
  },
);
