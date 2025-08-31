import { z } from 'zod'
import {
  UserSchema,
  ReviewerSchema,
  type User,
  type Reviewer,
} from '../schemas/db.schema'
import type { SearchField } from '../components/search-box/SearchBox'

const API_BASE_URL = 'http://localhost:3001'

interface FetchOptions {
  page?: number
  limit?: number
  search?: string
  searchField?: SearchField
}

interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  hasNextPage: boolean
  nextPage: number | null
}

function buildUrl(endpoint: string, options: FetchOptions): string {
  const url = new URL(`${API_BASE_URL}/${endpoint}`)

  if (options.page !== undefined) {
    url.searchParams.set('_page', options.page.toString())
  }

  if (options.limit !== undefined) {
    url.searchParams.set('_limit', options.limit.toString())
  }

  // Use field-specific search for json-server v1
  if (options.search && options.searchField) {
    url.searchParams.set(options.searchField, options.search)
  }

  return url.toString()
}

async function fetchPaginatedData<T>(
  endpoint: string,
  options: FetchOptions,
  schema: z.ZodType<T>,
): Promise<PaginatedResponse<T>> {
  const url = buildUrl(endpoint, options)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = (await response.json()) as unknown as T[]
  const validatedData = z.array(schema).parse(data)

  // Since json-server doesn't provide X-Total-Count with _page parameter,
  // we need to fetch total count separately or assume there are more pages
  // when we get a full page of results
  const currentPage = options.page ?? 1
  const limit = options.limit ?? 50

  // If we got a full page of results, assume there might be more
  const hasNextPage = validatedData.length === limit

  // Since search doesn't work with json-server, we'll estimate total count
  // This avoids the duplicate API call for counting
  const totalCount = validatedData.length

  return {
    data: validatedData,
    totalCount,
    hasNextPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
  }
}

export async function fetchUsers(
  options: FetchOptions = {},
): Promise<PaginatedResponse<User>> {
  return fetchPaginatedData('users', options, UserSchema)
}

export async function fetchReviewers(
  options: FetchOptions = {},
): Promise<PaginatedResponse<Reviewer>> {
  return fetchPaginatedData('reviewers', options, ReviewerSchema)
}

export const api = {
  users: {
    list: fetchUsers,
  },
  reviewers: {
    list: fetchReviewers,
  },
}

export type FetchFunction<T> = (
  options?: FetchOptions,
) => Promise<PaginatedResponse<T>>
