import { z } from 'zod'
import type { Event } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'

export const eventSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  createdBy: idSchema,
  eventDate: z.date(),
  // eventDate: z.string().transform((str) => new Date(str)),
  budgetLimit: z.number().int().positive(),
  status: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
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
