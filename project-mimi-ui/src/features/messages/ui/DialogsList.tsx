export type Dialog = {
  id: string
  name: string
  lastMessage: string
  timestamp: string
}

export const DialogsList = ({ items }: { items: Dialog[] }) => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No dialogs found.
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((dialog) => (
        <li key={dialog.id} className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{dialog.name}</h3>
              <p className="text-sm text-muted-foreground">{dialog.lastMessage}</p>
            </div>
            <div className="text-xs text-muted-foreground">{dialog.timestamp}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}

