import { z } from 'zod'
import { idSchema } from './shared'

export const eventRuleSchema = z.object({
  id: idSchema,
  eventId: idSchema,
  ruleType: z.string().min(1),
  ruleData: z.record(z.string(), z.unknown()),
})

export type EventRule = z.infer<typeof eventRuleSchema>

// For creating new wishlist items (without id and timestamps)
export const createEventRuleSchema = eventRuleSchema.omit({
  id: true,
})

export type CreateEventRule = z.infer<typeof createEventRuleSchema>

// TO DO: finish
