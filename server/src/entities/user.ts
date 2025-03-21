import { z } from 'zod'
import type { User } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'

export const userSchema = z.object({
  id: idSchema,
  auth0Id: z.string(),
  email: z.string().email('Invalid email address').trim(),
  createdAt: z.date(),
  firstName: z.string().min(1).optional().nullable(),
  lastName: z.string().min(1).optional().nullable(),
  picture: z.string().min(1).optional().nullable(),
  lastLogin: z.date().default(() => new Date()),
})

export const userKeysForMembers = Object.keys(
  userSchema.shape
) as (keyof User)[]

export type UserForMember = Pick<
  Selectable<User>,
  (typeof userKeysForMembers)[number]
>

export const userKeysForTesting = [
  'email',
  'firstName',
  'lastName',
  'picture',
] as const

export const authUserSchema = userSchema.pick({
  id: true,
  auth0Id: true,
})

export type AuthUser = z.infer<typeof authUserSchema>
