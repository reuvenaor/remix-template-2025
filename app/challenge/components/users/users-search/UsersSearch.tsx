import { useCallback } from 'react'
import { SearchBox } from '~/challenge/components/search-box/SearchBox'
import { useSearchWithDebounce } from '~/challenge/hooks/useSearchWithDebounce'
import { useUsersStore } from '~/challenge/stores/usersStore'

export default function UsersSearch(): React.ReactElement {
  const {
    usersSearch,
    usersSearchField,
    setUsersSearch,
    setUsersSearchField,
    resetSearch,
  } = useUsersStore()

  const usersSearchDebounced = useSearchWithDebounce({
    initialValue: usersSearch,
    delay: 300,
    onSearch: setUsersSearch,
  })

  const onClear = useCallback(() => {
    usersSearchDebounced.clearSearch()
    resetSearch()
  }, [usersSearchDebounced, resetSearch])

  return (
    <SearchBox
      value={usersSearchDebounced.searchValue}
      onChange={usersSearchDebounced.handleSearch}
      onClear={onClear}
      placeholder="Search users..."
      isSearching={usersSearchDebounced.isSearching}
      searchField={usersSearchField}
      onSearchFieldChange={setUsersSearchField}
      searchableFields={['firstName', 'email']}
    />
  )
}