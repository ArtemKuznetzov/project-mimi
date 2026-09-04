import ReactionPicker from "@/features/messages/ui/reaction-picker/ReactionPicker";
import { cn } from "@/lib/utils";
import type { MessageResponseDTO } from "@/shared/api/generated";
import type { MessageListProps } from "../message-list";

interface IMessageReactionsProps {
  reactions: MessageResponseDTO["messageReactions"];
  messageId: number;
  isMine: boolean;
  onToggleReaction: MessageListProps["messageActions"]["onToggleReaction"];
  className?: string;
}

const MessageReactions = ({
  reactions,
  isMine,
  onToggleReaction,
  className,
  messageId,
}: IMessageReactionsProps) => {
  const onSelect = (emoji: string) => {
    onToggleReaction?.(messageId, { emoji });
  };

  const messagesReactions = reactions ?? [];

  return (
    <div className={className}>
      {messagesReactions.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {messagesReactions.map((reaction) => {
            const counter = reaction.userIds?.length ?? 0;

            return (
              <div
                key={reaction.emoji}
                className={cn("cursor-pointer")}
              >
                {reaction.emoji}

                {counter > 0 && (
                  <span>{counter}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="absolute bottom-0 right-0 translate-y-1/2">
        <div className="group/reaction relative">
          <button
            type="button"
            className={cn(
              "flex size-7 items-center justify-center rounded-full",
              "text-lg",
              "opacity-0 transition-opacity duration-150",
              "group-hover:opacity-100",
            )}
          >
            ❤️
          </button>

          <div
            className={cn(
              "absolute bottom-0 z-50",
              "invisible opacity-0",
              "transition-opacity duration-150",
              "group-hover/reaction:visible",
              "group-hover/reaction:opacity-100",
              isMine ? "right-full" : "left-full",
            )}
          >
            <ReactionPicker onSelect={onSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReactions;
