import { useCallback, useMemo } from 'react'
import { VirtualizedList } from '~/challenge/components/list/virtualized-list/VirtualizedList'
import { useInfiniteList } from '~/challenge/hooks/useInfiniteList'
import type { User } from '~/challenge/schemas/db.schema'
import { useUsersStore } from '~/challenge/stores/usersStore'
import { UserItem } from '~/challenge/components/users/user-item/UserItem'
import { api, type FetchFunction } from '~/challenge/services/api'

export default function UsersList(): React.ReactElement {
  const {
    usersSearch,
    usersSearchField,
    usersScrollPosition,
    setUsersScrollPosition,
  } = useUsersStore()

  const usersList = useInfiniteList({
    type: 'users',
    search: usersSearch,
    searchField: usersSearchField,
    pageSize: 50,
    fetchFunction: api.users.list
  })

  const renderUserItem = useCallback((item: User) => {
    return <UserItem data={item} />
  }, [])

  const onRetry = useCallback(() => {
    usersList.refetch()
  }, [usersList])


  const emptyMessage = useMemo(() => {
    return usersSearch
      ? `No users found matching "${usersSearch}"`
      : 'No users available'
  }, [usersSearch])

  return (
    <VirtualizedList
      id="users-scroll-container"
      items={usersList.items}
      renderItem={renderUserItem}
      isLoading={usersList.isLoading}
      isError={usersList.isError}
      error={usersList.error as Error}
      isFetchingNextPage={usersList.isFetchingNextPage}
      hasNextPage={usersList.hasNextPage}
      fetchNextPage={usersList.fetchNextPage}
      onRetry={onRetry}
      scrollPosition={usersScrollPosition}
      onScrollPositionChange={setUsersScrollPosition}
      emptyMessage={emptyMessage}
    />
  )
}