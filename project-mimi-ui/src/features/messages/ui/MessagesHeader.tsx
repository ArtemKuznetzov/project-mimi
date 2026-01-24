import { Search, X } from 'lucide-react'
import { Input } from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button/Button'

type MessagesHeaderProps = {
  isSearchMode: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchToggle: () => void
  onSearchClear: () => void
}

export const MessagesHeader = ({
  isSearchMode,
  searchQuery,
  onSearchChange,
  onSearchToggle,
  onSearchClear,
}: MessagesHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isSearchMode ? 'Search' : 'Messages'}
        </h2>
        {isSearchMode && (
          <div className="relative">
            <Input
              placeholder="Search people"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-64 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onSearchClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onSearchToggle}
          aria-label="Toggle search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

