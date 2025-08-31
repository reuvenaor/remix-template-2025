import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface UseSearchWithDebounceOptions {
  initialValue?: string
  delay?: number
  onSearch?: (value: string) => void
}

export function useSearchWithDebounce({
  initialValue = '',
  delay = 300,
  onSearch,
}: UseSearchWithDebounceOptions = {}) {
  const [searchValue, setSearchValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value)
    setIsSearching(false)
    onSearch?.(value)
  }, delay)

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  const clearSearch = () => {
    setSearchValue('')
    setDebouncedValue('')
    setIsSearching(false)
    onSearch?.('')
  }

  useEffect(() => {
    if (initialValue !== searchValue) {
      setSearchValue(initialValue)
      setDebouncedValue(initialValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  return {
    searchValue,
    debouncedValue,
    isSearching,
    handleSearch,
    clearSearch,
  }
}
