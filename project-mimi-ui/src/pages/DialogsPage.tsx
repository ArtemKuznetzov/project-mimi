import { useMemo, useState } from 'react'
import { DialogsHeader } from '@/features/dialogs/ui/DialogsHeader'
import { DialogsList } from '@/features/dialogs/ui/DialogsList'
import { useGetDialogsQuery } from "@/features/dialogs/api/dialogsApi";

export const DialogsPage = () => {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: dialogsData = [] } = useGetDialogsQuery()

  const filteredDialogs = useMemo(() => {
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
      <DialogsHeader
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchToggle={handleSearchToggle}
        onSearchClear={handleSearchClear}
      />
      <DialogsList dialogs={filteredDialogs} />
    </div>
  )
}