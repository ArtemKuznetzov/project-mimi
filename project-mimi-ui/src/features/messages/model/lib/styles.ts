import { cn } from "@/lib/utils";
import { chatTokens } from "./chatTokens";

const bubbleShell = (isMine: boolean, isDeleted: boolean) =>
  cn(
    "inline-flex w-fit max-w-full flex-col rounded-2xl px-3 py-2 text-sm shadow-sm",
    isMine
      ? `rounded-br-sm bg-[${chatTokens.messageBubble.light.mine.bg}] text-[${chatTokens.text.primary.light}] dark:bg-[${chatTokens.messageBubble.dark.mine.bg}] dark:text-[${chatTokens.text.primary.dark}]`
      : "rounded-bl-sm bg-white text-[#111B21] shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1F2C33] dark:text-[#E9EDEF] dark:ring-white/[0.06]",
    isDeleted
      ? `bg-[${chatTokens.messageBubble.light.deleted.bg}] text-[${chatTokens.text.deleted.light}] italic ring-0 dark:bg-[${chatTokens.messageBubble.light.deleted.bgDark}] dark:text-[${chatTokens.text.deleted.dark}]`
      : null,
  );

const replySnippetClass = (isMine: boolean) =>
  cn(
    "mb-2 w-full text-left rounded-md border-l-[3px] px-2 py-1 text-[11px] leading-snug cursor-pointer",
    isMine
      ? `border-[${chatTokens.border.outgoing.light}] bg-[${chatTokens.replyBg.my.light}] text-[${chatTokens.text.secondary.light}]/85 dark:border-[${chatTokens.border.outgoing.dark}] dark:bg-[${chatTokens.replyBg.my.dark}] dark:text-[${chatTokens.text.secondary.dark}]/85`
      : `border-[${chatTokens.border.incoming.light}] bg-[${chatTokens.replyBg.your.light}] text-[${chatTokens.text.secondary.light}]/85 dark:border-[${chatTokens.border.incoming.dark}] dark:bg-[${chatTokens.replyBg.your.dark}] dark:text-[${chatTokens.text.secondary.dark}]/85`,
  );

const attachmentFrameClass = (isMine: boolean) =>
  cn(
    "max-w-[min(320px,92vw)] overflow-hidden rounded-2xl shadow-sm",
    isMine
      ? `rounded-br-md bg-[${chatTokens.messageBubble.light.mine.bg}] ring-1 ring-[${chatTokens.ring.message.light}] dark:bg-[${chatTokens.messageBubble.dark.mine.bg}] dark:ring-[${chatTokens.ring.message.dark}]`
      : "rounded-bl-md bg-white ring-1 ring-black/[0.06] dark:bg-[#1F2C33] dark:ring-white/[0.06]",
  );

const chatSurfaceClass = () => `bg-[${chatTokens.chatSurface.light}] dark:bg-[${chatTokens.chatSurface.dark}]`;

export { bubbleShell, replySnippetClass, attachmentFrameClass, chatSurfaceClass };
