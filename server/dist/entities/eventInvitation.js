import { z } from 'zod';
import { idSchema } from './shared';
export const eventInvitationSchema = z.object({
    id: idSchema,
    userId: idSchema,
    eventId: idSchema,
    email: z.string().email(),
    token: z.string().min(1),
    status: z.string().min(1),
    createdAt: z.date(),
    expiresAt: z.date(),
    updatedAt: z.date(),
});
export const invitationKeysForMembers = Object.keys(eventInvitationSchema.shape);
export const invitationKeysForTesting = [
    'email',
    'token',
    'status',
    'expiresAt'
];
