import { z } from 'zod'
import { idSchema } from './shared'

export const userEventSchema = z.object({
  id: idSchema,
  userId: idSchema,
  eventId: idSchema,
  role: z.string().min(1),
  wishlistId: idSchema,
  santaForUserId: idSchema,
  createdAt: z.date(),
})

export type UserEvent = z.infer<typeof userEventSchema>

// For creating new wishlist items (without id and timestamps)
export const createUserEventSchema = userEventSchema.omit({
  id: true,
  createdAt: true,
})

export type CreateUserEvent = z.infer<typeof createUserEventSchema>

// TO DO: finish
