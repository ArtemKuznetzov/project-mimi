import { Link } from 'react-router-dom'
import { UserAvatar } from "@/shared/ui";
import type { Dialogue } from "@/entities/dialogue";

export const DialoguesList = ({ dialogues }: { dialogues: Dialogue[] }) => {
  if (dialogues.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No dialogues found.
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {dialogues.map((dialogue) => (
        <li key={dialogue.id}>
          <Link
            to={`/messages/${dialogue.id}`}
            className="block rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:bg-gray-50/100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <UserAvatar
                    src={dialogue.user.imgSrc}
                    alt={dialogue.user.name}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{dialogue.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{dialogue.lastMessage}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{dialogue.timestamp}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

