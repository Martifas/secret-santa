import { z } from 'zod';
import type { UserEvent } from '../database/types';
import type { Selectable } from 'kysely';
export declare const userEventSchema: z.ZodObject<{
    id: z.ZodNumber;
    userId: z.ZodNumber;
    eventId: z.ZodNumber;
    role: z.ZodString;
    wishlistId: z.ZodNumber;
    santaForUserId: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    role: string;
    santaForUserId: number;
    userId: number;
    wishlistId: number;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    role: string;
    santaForUserId: number;
    userId: number;
    wishlistId: number;
}>;
export declare const userEventKeysForMembers: (keyof UserEvent)[];
export type UserEventForMember = Pick<Selectable<UserEvent>, (typeof userEventKeysForMembers)[number]>;
export declare const userEventKeysForTesting: readonly ["role"];
//# sourceMappingURL=userEvent.d.ts.map