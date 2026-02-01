import { MoreHorizontal } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button, UserAvatar } from '@/shared/ui'
import { useGetDialogsQuery } from '@/features/dialogues/api/dialogsApi'

// TODO add getMessagesByDialogId endpoint, delete find method
export const MessageHeader = () => {
  const { dialogueId } = useParams()
  const { data: dialogues = [] } = useGetDialogsQuery()

  const dialogue = dialogues.find((item) => item.id === Number(dialogueId))

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
        <UserAvatar
          avatarId={dialogue.userAvatarId}
          alt={dialogue.userName}
        />
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {dialogue.userName}
          </h2>
          <p className="text-xs text-muted-foreground">{`Last online ${dialogue.lastMessageDate}`}</p>
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" aria-label="Dialog actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </header>
  )
}