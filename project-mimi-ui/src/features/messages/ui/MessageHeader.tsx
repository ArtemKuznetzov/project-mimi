import { MoreHorizontal } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { DIALOGUES } from '@/entities/dialogue'
import { Button, UserAvatar } from '@/shared/ui'

export const MessageHeader = () => {
  const { dialogueId } = useParams()

  const dialogue = DIALOGUES.find((item) => item.id === Number(dialogueId))

  if (!dialogue) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No messages found.
      </div>
    )
  }

  return (
    <header className="flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <UserAvatar src={dialogue.user.imgSrc} alt={dialogue.user.name} />
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
            {dialogue.user.name}
          </h2>
          <p className="text-xs text-muted-foreground">{`Last online ${dialogue.timestamp}`}</p>
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" aria-label="Dialog actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </header>
  )
}