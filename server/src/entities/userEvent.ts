import { z } from 'zod'
import type { UserEvent } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'

export const userEventSchema = z.object({
  id: idSchema,
  userId: z.string(),
  eventTitle: z.string(),
  eventId: idSchema,
  role: z.string().min(1),
  wishlistId: idSchema,
  santaForUserId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userEventKeysForMembers = Object.keys(
  userEventSchema.shape
) as (keyof UserEvent)[]

export type UserEventForMember = Pick<
  Selectable<UserEvent>,
  (typeof userEventKeysForMembers)[number]
>

export const userEventKeysForTesting = ['role'] as const
