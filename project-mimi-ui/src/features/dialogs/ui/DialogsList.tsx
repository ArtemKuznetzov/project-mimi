import { Link } from "react-router-dom";
import { UserAvatar } from "@/shared/ui";
import type { DialogResponseDTO } from "@/shared/api/generated";
import { getDateStr } from "@/shared/lib/dateUtils";
import { useAppSelector } from "@/app/hooks";

export const DialogsList = ({ dialogs }: { dialogs: DialogResponseDTO[] }) => {
  const currentUserId = useAppSelector((state) => state.auth.userId);

  if (dialogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No dialogs found.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {dialogs.map((dialog) => {
        const isMine = currentUserId !== null && dialog.lastMessageUserId === currentUserId;

        return (
          <li key={dialog.id}>
            <Link
              to={`/messages/${dialog.id}`}
              className="block rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:bg-gray-50/100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="shrink-0">
                    <UserAvatar avatarId={dialog.userAvatarId} alt={dialog.userName} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{dialog.userName}</h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {isMine ? `You: ${dialog.lastMessageBody}` : dialog.lastMessageBody}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">{getDateStr(dialog.lastMessageDate)}</div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
