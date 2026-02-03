import { Link } from 'react-router-dom'
import { UserAvatar } from "@/shared/ui";
import type { DialogResponseDTO } from "@/shared/api/generated";
import { getDateStr } from "@/shared/lib/dateUtils";

export const DialogsList = ({ dialogs }: { dialogs: DialogResponseDTO[] }) => {
  if (dialogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No dialogs found.
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {dialogs.map((dialog) => (
        <li key={dialog.id}>
          <Link
            to={`/messages/${dialog.id}`}
            className="block rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:bg-gray-50/100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <UserAvatar
                    avatarId={dialog.userAvatarId}
                    alt={dialog.userName}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{dialog.userName}</h3>
                  <p className="text-sm text-muted-foreground">{dialog.lastMessageBody}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{getDateStr(dialog.lastMessageDate)}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

