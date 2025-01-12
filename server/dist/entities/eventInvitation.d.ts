import { z } from 'zod';
import type { Selectable } from 'kysely';
import type { EventInvitations } from '../database';
export declare const eventInvitationSchema: z.ZodObject<{
    id: z.ZodNumber;
    userId: z.ZodNumber;
    eventId: z.ZodNumber;
    email: z.ZodString;
    token: z.ZodString;
    status: z.ZodString;
    createdAt: z.ZodDate;
    expiresAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    email: string;
    createdAt: Date;
    status: string;
    updatedAt: Date;
    eventId: number;
    userId: number;
    token: string;
    expiresAt: Date;
}, {
    id: number;
    email: string;
    createdAt: Date;
    status: string;
    updatedAt: Date;
    eventId: number;
    userId: number;
    token: string;
    expiresAt: Date;
}>;
export declare const invitationKeysForMembers: (keyof EventInvitations)[];
export type InvitationForMember = Pick<Selectable<EventInvitations>, (typeof invitationKeysForMembers)[number]>;
export declare const invitationKeysForTesting: readonly ["email", "token", "status", "expiresAt"];
//# sourceMappingURL=eventInvitation.d.ts.map