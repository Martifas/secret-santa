import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Wishlist } from '@server/database'
import { idSchema } from './shared'

export const wishlistSchema = z.object({
  id: idSchema,
  userId: z.string(),
  itemName: z.string().min(1),
  description: z.string().nullable().optional(),
  price: z.number().int().nonnegative().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const wishlistKeys = Object.keys(
  wishlistSchema.shape
) as (keyof Wishlist)[]

export type WishlistForMember = Pick<
  Selectable<Wishlist>,
  (typeof wishlistKeys)[number]
>

export const wishlistKeysForTesting = [
  'itemName',
  'description',
  'price',
] as const
