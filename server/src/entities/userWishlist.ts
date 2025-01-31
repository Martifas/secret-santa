import { z } from 'zod'
import type { UserWishlist } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'

export const userWishlistSchema = z.object({
  id: idSchema,
  userId: z.string(),
  wishlistId: idSchema,
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userWishlistKeysForMembers = Object.keys(
  userWishlistSchema.shape
) as (keyof UserWishlist)[]

export type UserWishlistForMember = Pick<
  Selectable<UserWishlist>,
  (typeof userWishlistKeysForMembers)[number]
>

export const userWishlistKeysForTesting = ['title', 'userId', 'description'] as const