import { z } from 'zod'
import type { EventRule } from '@server/database/types'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'


export const eventRuleSchema = z.object({
  id: idSchema,
  eventId: idSchema,
  ruleType: z.string().min(1),
  ruleData: z.record(z.string(), z.unknown()),
})

export const ruleKeysForMembers = Object.keys(
  eventRuleSchema.shape
) as (keyof EventRule)[]

export type RuleForMember = Pick<
  Selectable<EventRule>,
  (typeof ruleKeysForMembers)[number]
>

export const ruleKeysForTesting = [
  'ruleData',
  'ruleType',
] as const
