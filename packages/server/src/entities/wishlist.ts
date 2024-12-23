import { z } from 'zod'
import { idSchema } from './shared'

export const wishlistSchema = z.object({
  id: idSchema,
  userId: idSchema,
  eventId: idSchema,
  itemName: z.string().min(1),
  description: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  priority: z.number().int().min(1).max(5).nullable().optional(),
  isPurchased: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Wishlist = z.infer<typeof wishlistSchema>

// For creating new wishlist items (without id and timestamps)
export const createWishlistSchema = wishlistSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateWishlist = z.infer<typeof createWishlistSchema>

// TO DO: finish
