import { useMemo, useState } from 'react'
import { MessagesHeader } from '@/features/messages/ui/MessagesHeader'
import { DialogsList, type Dialog } from '@/features/messages/ui/DialogsList'

const dialogs: Dialog[] = [
  { id: '1', name: 'Beyza', lastMessage: 'Günaydın!', timestamp: '10:24' },
  { id: '2', name: 'Pofu', lastMessage: 'Meow meow meow Beyza meow meow meow!', timestamp: '09:50' },
  { id: '3', name: 'Mifa', lastMessage: "YOU'VE LOST ME IN THE PYRAMID, SUKA. FIND ME", timestamp: 'Yesterday' },
]

export const MessagesPage = () => {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDialogs = useMemo(() => {
    if (!searchQuery.trim()) {
      return dialogs
    }
    const query = searchQuery.toLowerCase()
    return dialogs.filter((dialog) => dialog.name.toLowerCase().includes(query))
  }, [searchQuery])

  const handleSearchToggle = () => {
    setIsSearchMode((prev) => !prev)
    if (isSearchMode) {
      setSearchQuery('')
    }
  }

  const handleSearchClear = () => {
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      <MessagesHeader
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchToggle={handleSearchToggle}
        onSearchClear={handleSearchClear}
      />
      <DialogsList items={filteredDialogs} />
    </div>
  )
}