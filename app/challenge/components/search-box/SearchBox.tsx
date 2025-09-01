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

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  isSearching?: boolean
  disabled?: boolean
}

interface FieldSelectorDropdownProps {
  searchField: SearchField
  onSearchFieldChange: (field: SearchField) => void
  searchableFields: SearchField[]
  disabled?: boolean
}

interface SearchBoxProps extends SearchInputProps, FieldSelectorDropdownProps {
}

function FieldSelectorDropdown({
  searchField,
  onSearchFieldChange,
  searchableFields,
  disabled = false,
}: FieldSelectorDropdownProps) {
  const fieldLabels: Record<SearchField, string> = {
    firstName: 'First Name',
    email: 'Email',
  }

  if (searchableFields.length <= 1) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='min-w-[120px] justify-between flex-1 min-h-11'
          disabled={disabled}
        >
          {fieldLabels[searchField]}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {searchableFields.map((field) => (
          <DropdownMenuItem
            key={field}
            onClick={() => {
              onSearchFieldChange(field)
            }}
            className={searchField === field ? 'bg-accent' : ''}
          >
            {fieldLabels[field]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  isSearching = false,
  disabled = false,
}: SearchInputProps) {
  return (
    <div className='relative flex-[3]'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='text'
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        disabled={disabled}
        className='pl-10 pr-10 min-h-11'
        aria-label={placeholder}
      />
      <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1'>
        {isSearching && (
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
        )}
        {value && !isSearching && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={onClear}
            className='h-6 w-6 p-0'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
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

  const searchPlaceholder = placeholder || `Search by ${fieldLabels[searchField].toLowerCase()}...`

  return (
    <div className='relative w-full px-4'>
      <div className='flex gap-4 items-center justify-center'>
        <FieldSelectorDropdown
          searchField={searchField}
          onSearchFieldChange={onSearchFieldChange}
          searchableFields={searchableFields}
          disabled={disabled}
        />
        <SearchInput
          value={value}
          onChange={onChange}
          onClear={onClear}
          placeholder={searchPlaceholder}
          isSearching={isSearching}
          disabled={disabled}
        />
      </div>
    </div>
  )
}