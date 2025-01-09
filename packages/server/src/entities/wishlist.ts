import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Wishlist } from '@server/database'
import { idSchema } from './shared'

export const wishlistSchema = z.object({
  id: idSchema,
  userId: idSchema,
  eventId: idSchema,
  itemName: z.string().min(1),
  description: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  price: z.number().int().positive().nullable().optional(),
  priority: z.number().int().min(1).max(5).nullable().optional(),
  isPurchased: z.boolean().default(false),
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
  'url',
  'price',
  'priority',
  'isPurchased',
] as const
