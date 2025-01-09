import { z } from 'zod';
import type { Event } from '../database/types';
import type { Selectable } from 'kysely';
export declare const eventSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodString;
    createdBy: z.ZodNumber;
    eventDate: z.ZodEffects<z.ZodString, Date, string>;
    budgetLimit: z.ZodNumber;
    status: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    status: string;
    name: string;
    description: string;
    createdBy: number;
    eventDate: Date;
    budgetLimit: number;
    updatedAt: Date;
}, {
    id: number;
    createdAt: Date;
    status: string;
    name: string;
    description: string;
    createdBy: number;
    eventDate: string;
    budgetLimit: number;
    updatedAt: Date;
}>;
export declare const eventKeysForMembers: (keyof Event)[];
export type EventForMember = Pick<Selectable<Event>, (typeof eventKeysForMembers)[number]>;
export declare const eventKeysForTesting: readonly ["name", "description", "eventDate", "budgetLimit", "status"];
//# sourceMappingURL=event.d.ts.map