import { cn } from "@/lib/utils";

const bubbleShell = (isMine: boolean, isDeleted: boolean) =>
  cn(
    "inline-flex w-fit max-w-full flex-col rounded-2xl px-3 py-2 text-sm shadow-sm",
    isMine
      ? "bg-blue-500 text-white rounded-br-sm"
      : "bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100",
    isDeleted ? "bg-gray-200 text-gray-500 italic dark:bg-gray-700 dark:text-gray-300" : null,
  );

const replySnippetClass = (isMine: boolean) =>
  cn(
    "mb-2 w-full rounded-md border-l-2 px-2 py-1 text-[11px] leading-snug",
    isMine
      ? "border-white/60 bg-white/15 text-white/90"
      : "border-blue-500/60 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  );

const attachmentFrameClass = (isMine: boolean) =>
  cn(
    "max-w-[min(280px,85vw)] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 dark:ring-white/10",
    isMine ? "rounded-br-md" : "rounded-bl-md",
  );

export {bubbleShell, replySnippetClass, attachmentFrameClass};