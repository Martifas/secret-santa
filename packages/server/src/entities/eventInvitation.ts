import { z } from 'zod'
import { idSchema } from './shared'

export const eventInvitationSchema = z.object({
  id: idSchema,
  eventId: idSchema,
  email: z.string().email(),
  token: z.string().min(1),
  status: z.string().min(1),
  createdAt: z.date(),
  expiresAt: z.date()
})

export type EventInvitation = z.infer<typeof eventInvitationSchema>

export const createEventInvitationSchema = eventInvitationSchema.omit({
  id: true,
  createdAt: true,
})

export type CreateEventInvitation = z.infer<typeof createEventInvitationSchema>

// TO DO: finish
