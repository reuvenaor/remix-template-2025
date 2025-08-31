import { z } from 'zod'

export const DefaultItemListSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  catchPhrase: z.string(),
  comments: z.string(),
})

export type DefaultItemList = z.infer<typeof DefaultItemListSchema>

export const UserSchema = DefaultItemListSchema

export const ReviewerSchema = UserSchema

export const PaginationMetaSchema = z.object({
  totalCount: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const ApiResponseSchema = z.object({
  data: z.array(UserSchema),
  meta: PaginationMetaSchema.optional(),
})

export const SearchParamsSchema = z.object({
  q: z.string().optional(),
  _page: z.number().positive().optional(),
  _limit: z.number().positive().optional(),
})

export type User = z.infer<typeof UserSchema>
export type Reviewer = z.infer<typeof ReviewerSchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type ApiResponse<T> = {
  data: T[]
  meta?: PaginationMeta
}
export type SearchParams = z.infer<typeof SearchParamsSchema>