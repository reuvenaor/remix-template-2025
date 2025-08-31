import { create } from 'zustand'
import type { SearchField } from '~/challenge/components/search-box/SearchBox'

interface ListState {
  reviewersSearch: string
  reviewersSearchField: SearchField
  reviewersScrollPosition: number
  setReviewersSearch: (search: string) => void
  setReviewersSearchField: (field: SearchField) => void
  setReviewersScrollPosition: (position: number) => void
  resetSearch: () => void
}

export const useReviewersStore = create<ListState>((set) => ({
  reviewersSearch: '',
  reviewersSearchField: 'firstName',
  reviewersScrollPosition: 0,

  setReviewersSearch: (search) => {
    set({ reviewersSearch: search })
  },
  setReviewersSearchField: (field) => {
    set({ reviewersSearchField: field })
  },
  setReviewersScrollPosition: (position) => {
    set({ reviewersScrollPosition: position })
  },
  resetSearch: () => {
    set({ reviewersSearch: '', reviewersScrollPosition: 0 })
  },
}))
