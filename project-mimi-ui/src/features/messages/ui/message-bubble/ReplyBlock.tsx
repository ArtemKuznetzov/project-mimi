import { replySnippetClass } from "@/features/messages/model";
import type { UiMessage } from "@/entities/message";

type ReplyBlockProps = {
  isMine: boolean;
  isDeleted: boolean;
  onClick: (id: number) => void;
  replyMessage: UiMessage["replyMessage"];
};

export const ReplyBlock = ({ isMine, isDeleted, replyMessage, onClick }: ReplyBlockProps) => {
  return !isDeleted && replyMessage ? (
    <button type="button" className={replySnippetClass(isMine)} onClick={() => onClick(replyMessage.id)}>
      <div className="truncate font-medium">{replyMessage.userName}</div>
      <div className="truncate opacity-80">{replyMessage.body}</div>
    </button>
  ) : null;
};
