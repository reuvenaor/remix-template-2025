
import { useCallback } from 'react'
import { SearchBox } from '~/challenge/components/search-box/SearchBox'
import { useSearchWithDebounce } from '~/challenge/hooks/useSearchWithDebounce'
import { useReviewersStore } from '~/challenge/stores/reviewersStore'

export default function ReviewersSearch(): React.ReactElement {
  const {
    reviewersSearch,
    reviewersSearchField,
    setReviewersSearch,
    setReviewersSearchField,
    resetSearch,
  } = useReviewersStore()

  const reviewersSearchDebounced = useSearchWithDebounce({
    initialValue: reviewersSearch,
    delay: 300,
    onSearch: setReviewersSearch,
  })

  const onClear = () => useCallback(() => {
    reviewersSearchDebounced.clearSearch()
    resetSearch()
  }, [reviewersSearchDebounced, resetSearch])

  return (
    <SearchBox
      value={reviewersSearchDebounced.searchValue}
      onChange={reviewersSearchDebounced.handleSearch}
      onClear={onClear}
      placeholder="Search reviewers..."
      isSearching={reviewersSearchDebounced.isSearching}
      searchField={reviewersSearchField}
      onSearchFieldChange={setReviewersSearchField}
      searchableFields={['firstName', 'email']}
    />
  )
}