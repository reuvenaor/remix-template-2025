import { useCallback, useMemo } from 'react'
import { VirtualizedList } from '~/challenge/components/list/virtualized-list/VirtualizedList'
import { ReviewerItem } from '~/challenge/components/reviewers/reviewer-item/ReviewerItem'
import { useInfiniteList } from '~/challenge/hooks/useInfiniteList'
import type { Reviewer } from '~/challenge/schemas/db.schema'
import { api } from '~/challenge/services/api'
import { useReviewersStore } from '~/challenge/stores/reviewersStore'

export default function ReviewersList(): React.ReactElement {
  const {
    reviewersSearch,
    reviewersSearchField,
    reviewersScrollPosition,
    setReviewersScrollPosition,
  } = useReviewersStore()

  const reviewersList = useInfiniteList({
    type: 'reviewers',
    search: reviewersSearch,
    searchField: reviewersSearchField,
    pageSize: 50,
    fetchFunction: api.reviewers.list,
  })

  const renderReviewerItem = useCallback((item: Reviewer) => {
    return <ReviewerItem data={item} />
  }, [])

  const onRetry = useCallback(() => {
    reviewersList.refetch()
  }, [reviewersList])

  const emptyMessage = useMemo(() => {
    return reviewersSearch
      ? `No reviewers found matching "${reviewersSearch}"`
      : 'No reviewers available'
  }, [reviewersSearch])

  return (
    <VirtualizedList
      id="reviewers-scroll-container"
      items={reviewersList.items}
      renderItem={renderReviewerItem}
      isLoading={reviewersList.isLoading}
      isError={reviewersList.isError}
      error={reviewersList.error as Error}
      isFetchingNextPage={reviewersList.isFetchingNextPage}
      hasNextPage={reviewersList.hasNextPage}
      fetchNextPage={reviewersList.fetchNextPage}
      onRetry={onRetry}
      scrollPosition={reviewersScrollPosition}
      onScrollPositionChange={setReviewersScrollPosition}
      emptyMessage={emptyMessage}
    />
  )
}