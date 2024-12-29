import { z } from 'zod'
import type { User } from '@server/database/types'
import type { Selectable } from 'kysely'
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
  lastLogin: z.date().default(() => new Date()),
})

export const userKeysForMembers = Object.keys(
  userSchema.shape
) as (keyof User)[]

export type UserForMember = Pick<
  Selectable<User>,
  (typeof userKeysForMembers)[number]
>
