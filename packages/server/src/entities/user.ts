import { z } from 'zod'
import { idSchema } from './shared'

export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  createdAt: z.date(),
  firstName: z.string().min(1).optional().nullable(),
  lastName: z.string().min(1).optional().nullable(),
  avatarUrl: z.string().min(1).optional().nullable(),
  lastLogin: z.date().default(() => new Date ()),
})

export type User = z.infer<typeof userSchema>

// For creating new wishlist items (without id and timestamps)
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
})

export type CreateUser = z.infer<typeof createUserSchema>

// TO DO: finish
