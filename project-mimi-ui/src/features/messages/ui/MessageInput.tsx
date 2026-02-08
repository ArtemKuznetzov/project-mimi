import { useState, type FormEvent } from "react";
import { useAppSelector } from "@/app/hooks";
import type { MessageCreatePayload } from "@/shared/lib/websoket/types";
import { Button, Input } from "@/shared/ui";

type MessageInputProps = {
  onSend: (payload: MessageCreatePayload) => boolean;
};

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [value, setValue] = useState("");
  const userId = useAppSelector((state) => state.auth.userId);
  const trimmedValue = value.trim();
  const canSend = Boolean(userId) && trimmedValue.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }
    onSend({ body: trimmedValue });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input placeholder="Message" value={value} onChange={(event) => setValue(event.target.value)} />
      <Button type="submit" disabled={!canSend}>
        Send
      </Button>
    </form>
  );
};
