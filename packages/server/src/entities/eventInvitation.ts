import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { EventInvitations } from '@server/database'
import { idSchema } from './shared'

export const eventInvitationSchema = z.object({
  id: idSchema,
  userId: idSchema,
  eventId: idSchema,
  email: z.string().email(),
  token: z.string().min(1),
  status: z.string().min(1),
  createdAt: z.date(),
  expiresAt: z.date()
})

export const invitationKeys = Object.keys(eventInvitationSchema.shape) as (keyof EventInvitations)[]

export type InvitationForMember = Pick<
  Selectable<EventInvitations>,
  (typeof invitationKeys )[number]
>

export const invitationKeysForTesting = [
  'email',
  'token',
  'status'
] as const

