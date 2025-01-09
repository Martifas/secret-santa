import { z } from 'zod';
import { idSchema } from './shared';
export const eventRuleSchema = z.object({
    id: idSchema,
    eventId: idSchema,
    ruleType: z.string().min(1),
    ruleData: z.record(z.unknown()).transform((val) => val),
});
export const ruleKeysForMembers = Object.keys(eventRuleSchema.shape);
export const ruleKeysForTesting = [
    'ruleData',
    'ruleType',
];
