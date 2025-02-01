import { z } from 'zod'
import type { Event } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'

export const eventSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  createdBy: z.string(),
  eventDate: z.coerce.date(),
  budgetLimit: z.number().int().positive(),
  status: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const eventKeysForMembers = Object.keys(
  eventSchema.shape
) as (keyof Event)[]

export type EventForMember = Pick<
  Selectable<Event>,
  (typeof eventKeysForMembers)[number]
>

export const eventKeysForTesting = [
  'name',
  'description',
  'eventDate',
  'budgetLimit',
  'status',
] as const
