import { useMemo, useState } from 'react'
import { DialoguesHeader } from '@/features/dialogues/ui/DialoguesHeader.tsx'
import { DialoguesList } from '@/features/dialogues/ui/DialoguesList.tsx'
import { DIALOGUES } from "@/entities/dialogue";

export const DialoguesPage = () => {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDialogues = useMemo(() => {
    if (!searchQuery.trim()) {
      return DIALOGUES
    }
    const query = searchQuery.toLowerCase()
    return DIALOGUES.filter((message) => message.user.name.toLowerCase().includes(query))
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
      <DialoguesHeader
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchToggle={handleSearchToggle}
        onSearchClear={handleSearchClear}
      />
      <DialoguesList dialogues={filteredDialogues} />
    </div>
  )
}