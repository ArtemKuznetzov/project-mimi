import { MoreHorizontal } from "lucide-react";
import { Button, UserAvatar } from "@/shared/ui";
import type { DialogResponseDTO } from "@/shared/api/generated";
import { getDateStr } from "@/shared/lib/dateUtils";

type MessageHeaderProps = {
  dialog?: DialogResponseDTO;
};

export const MessageHeader = ({ dialog }: MessageHeaderProps) => {
  if (!dialog) {
    return <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No messages found.</div>;
  }

  return (
    <header className="flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <UserAvatar avatarId={dialog.userAvatarId} alt={dialog.userName} />
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{dialog.userName}</h2>
          <p className="text-xs text-muted-foreground">{`Last online ${getDateStr(dialog.lastMessageDate)}`}</p>
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" aria-label="Dialog actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </header>
  );
};
