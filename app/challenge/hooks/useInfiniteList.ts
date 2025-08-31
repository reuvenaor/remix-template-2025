import { useInfiniteQuery } from '@tanstack/react-query'
import type { SearchField } from '../components/search-box/SearchBox'
import { api } from '../services/api'

type DataType = 'users' | 'reviewers'

interface UseInfiniteListOptions {
  type: DataType
  search?: string
  searchField?: SearchField
  pageSize?: number
}

export function useInfiniteList({
  type,
  search,
  searchField = 'firstName',
  pageSize = 50,
}: UseInfiniteListOptions) {
  const queryKey = [type, search, searchField, pageSize]

  const fetchFunction = type === 'users' ? api.users.list : api.reviewers.list

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchFunction({
        page: pageParam,
        limit: pageSize,
        search,
        searchField,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const allItems = query.data?.pages.flatMap((page) => page.data) ?? []
  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    items: allItems,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  }
}
