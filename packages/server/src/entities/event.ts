import { z } from 'zod'
import { idSchema } from './shared'

export const eventSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  createdBy: idSchema,
  eventDate: z.date(),
  budgetLimit: z.number().int().positive(),
  status: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Event = z.infer<typeof eventSchema>

// For creating new wishlist items (without id and timestamps)
export const createEventSchema = eventSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
   })

export type CreateEvent = z.infer<typeof createEventSchema>

// TO DO: finish
