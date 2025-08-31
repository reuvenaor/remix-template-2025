import { Search, X, Loader2, ChevronDown } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export type SearchField = 'firstName' | 'email'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  isSearching?: boolean
  disabled?: boolean
  searchField?: SearchField
  onSearchFieldChange?: (field: SearchField) => void
  searchableFields?: SearchField[]
}

export function SearchBox({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  isSearching = false,
  disabled = false,
  searchField = 'firstName',
  onSearchFieldChange,
  searchableFields = ['firstName', 'email'],
}: SearchBoxProps) {
  const fieldLabels: Record<SearchField, string> = {
    firstName: 'First Name',
    email: 'Email',
  }

  return (
    <div className="relative w-full px-4">
      <div className="flex gap-2 items-center justify-center">
        {/* Field Selector Dropdown */}
        {onSearchFieldChange && searchableFields.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[120px] justify-between"
                disabled={disabled}
              >
                {fieldLabels[searchField]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {searchableFields.map((field) => (
                <DropdownMenuItem
                  key={field}
                  onClick={() => onSearchFieldChange(field)}
                  className={searchField === field ? 'bg-accent' : ''}
                >
                  {fieldLabels[field]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder={placeholder || `Search by ${fieldLabels[searchField].toLowerCase()}...`}
            disabled={disabled}
            className="pl-10 pr-10"
            aria-label={placeholder}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {value && !isSearching && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-6 w-6 p-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}