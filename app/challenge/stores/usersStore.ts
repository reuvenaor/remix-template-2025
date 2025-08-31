import { create } from 'zustand'
import type { SearchField } from '~/challenge/components/search-box/SearchBox'

interface UsersState {
  usersSearch: string
  usersSearchField: SearchField
  usersScrollPosition: number
  setUsersSearch: (search: string) => void
  setUsersSearchField: (field: SearchField) => void
  setUsersScrollPosition: (position: number) => void
  resetSearch: () => void
}

export const useUsersStore = create<UsersState>((set) => ({
  usersSearch: '',
  usersSearchField: 'firstName',
  reviewersSearch: '',
  usersScrollPosition: 0,
  reviewersScrollPosition: 0,

  setUsersSearch: (search) => {
    set({ usersSearch: search })
  },
  setUsersSearchField: (field) => {
    set({ usersSearchField: field })
  },
  setUsersScrollPosition: (position) => {
    set({ usersScrollPosition: position })
  },
  resetSearch: () => {
    set({ usersSearch: '', usersScrollPosition: 0 })
  },
}))
