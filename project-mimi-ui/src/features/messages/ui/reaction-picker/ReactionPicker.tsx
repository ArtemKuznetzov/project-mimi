import { cn } from "@/lib/utils";

const EMOJIS = ["🚀", "🤔", "👀", "💯", "🙏", "🎉", "🔥", "😢", "😮", "😂", "👍", "❤️"] as const;

interface IReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const ReactionPicker = ({ onSelect }: IReactionPickerProps) => {
  return (
    <div
      className={cn(
       "flex max-h-52 flex-col gap-0.5 overflow-y-auto",
    "rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-lg",
      )}
      role="menu"
      aria-label="Reaction picker"
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="menuitem"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            "text-xl transition-transform duration-100",
            "hover:scale-125 hover:bg-zinc-100",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(emoji);
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;