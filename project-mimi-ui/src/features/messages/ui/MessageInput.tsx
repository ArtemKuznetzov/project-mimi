import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useAppSelector } from "@/app/hooks";
import type { UiMessage } from "@/entities/message";
import type { MessageCreatePayload } from "@/shared/lib/websoket/types";
import { Button, Input } from "@/shared/ui";

type MessageInputProps = {
  onSend: (payload: MessageCreatePayload) => void;
  onEdit: (messageId: number, body: string) => void;
  selectedMessage?: UiMessage;
  onCancelEdit: () => void;
};

export const MessageInput = ({ onSend, onEdit, selectedMessage, onCancelEdit }: MessageInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useAppSelector((state) => state.auth.userId);
  const trimmedValue = value.trim();
  const isEditing = selectedMessage?.action === "edit";
  const canSubmit = Boolean(userId) && trimmedValue.length > 0;

  useEffect(() => {
    if (isEditing && selectedMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(selectedMessage.body);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isEditing, selectedMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    if (isEditing && selectedMessage) {
      onEdit(selectedMessage.id, trimmedValue);
      onCancelEdit();
    } else {
      onSend({ body: trimmedValue });
    }
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && isEditing) {
      onCancelEdit();
      setValue("");
    }
  };

  const onCancelButtonClick = () => {
    onCancelEdit();
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        ref={inputRef}
        placeholder={isEditing ? "Edit message..." : "Message"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {isEditing && (
        <Button type="button" variant="outline" onClick={onCancelButtonClick}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={!canSubmit}>
        {isEditing ? "Save" : "Send"}
      </Button>
    </form>
  );
};
