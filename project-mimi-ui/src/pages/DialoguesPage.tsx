import { useMemo, useState } from 'react'
import { DialoguesHeader } from '@/features/dialogues/ui/DialoguesHeader.tsx'
import { DialoguesList } from '@/features/dialogues/ui/DialoguesList.tsx'
import { useGetDialogsQuery } from "@/features/dialogues/api/dialogsApi.ts";

export const DialoguesPage = () => {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: dialogsData = [] } = useGetDialogsQuery()

  const filteredDialogues = useMemo(() => {
    if (!searchQuery.trim()) {
      return dialogsData
    }
    const query = searchQuery.toLowerCase()
    return dialogsData.filter((message) => (message.userName ?? '').toLowerCase().includes(query))
  }, [dialogsData, searchQuery])

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