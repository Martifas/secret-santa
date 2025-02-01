import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { EventInvitations } from '@server/database'
import { idSchema } from './shared'

export const eventInvitationSchema = z.object({
  id: idSchema,
  userId: idSchema,
  eventId: idSchema,
  email: z.string().email(),
  status: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const invitationKeysForMembers = Object.keys(
  eventInvitationSchema.shape
) as (keyof EventInvitations)[]

export type InvitationForMember = Pick<
  Selectable<EventInvitations>,
  (typeof invitationKeysForMembers)[number]
>

export const invitationKeysForTesting = ['email', 'status'] as const
