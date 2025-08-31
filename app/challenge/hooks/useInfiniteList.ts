import { useInfiniteQuery } from '@tanstack/react-query'
import type { SearchField } from '~/challenge/components/search-box/SearchBox'
import { type FetchFunction } from '~/challenge/services/api'
import { useMemo } from 'react'

type DataType = 'users' | 'reviewers'

interface UseInfiniteListOptions<T> {
  type: DataType
  search?: string
  searchField?: SearchField
  pageSize?: number
  fetchFunction: FetchFunction<T>
}

export function useInfiniteList<T>({
  type,
  search,
  searchField = 'firstName',
  pageSize = 50,
  fetchFunction,
}: UseInfiniteListOptions<T>) {
  const queryKey = [type, search, searchField, pageSize]

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

  const allItems = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  )
  const totalCount = useMemo(
    () => query.data?.pages[0]?.totalCount ?? 0,
    [query.data],
  )

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
