import { z } from 'zod';
import type { EventRule } from '../database/types';
import type { Selectable } from 'kysely';
export declare const eventRuleSchema: z.ZodObject<{
    id: z.ZodNumber;
    eventId: z.ZodNumber;
    ruleType: z.ZodString;
    ruleData: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodUnknown>, string | number | boolean | import("../database/types").JsonArray | import("../database/types").JsonObject | null, Record<string, unknown>>;
}, "strip", z.ZodTypeAny, {
    id: number;
    eventId: number;
    ruleType: string;
    ruleData: string | number | boolean | import("../database/types").JsonArray | import("../database/types").JsonObject | null;
}, {
    id: number;
    eventId: number;
    ruleType: string;
    ruleData: Record<string, unknown>;
}>;
export declare const ruleKeysForMembers: (keyof EventRule)[];
export type RuleForMember = Pick<Selectable<'eventRule'>, (typeof ruleKeysForMembers)[number]>;
export declare const ruleKeysForTesting: readonly ["ruleData", "ruleType"];
//# sourceMappingURL=eventRule.d.ts.map