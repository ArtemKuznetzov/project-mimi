import { replySnippetClass } from "@/features/messages/model";
import type { UiMessage } from "@/entities/message";

type ReplyBlockProps = {
  isMine: boolean;
  isDeleted: boolean;
  replyMessage: UiMessage["replyMessage"];
};

export const ReplyBlock = ({ isMine, isDeleted, replyMessage }: ReplyBlockProps) => {
  return !isDeleted && replyMessage ? (
    <div className={replySnippetClass(isMine)}>
      <div className="truncate font-medium">{replyMessage.userName}</div>
      <div className="truncate opacity-80">{replyMessage.body}</div>
    </div>
  ) : null;
};
