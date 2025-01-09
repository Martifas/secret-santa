import { z } from 'zod';
import { idSchema } from './shared';
export const userEventSchema = z.object({
    id: idSchema,
    userId: idSchema,
    eventId: idSchema,
    role: z.string().min(1),
    wishlistId: idSchema,
    santaForUserId: idSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const userEventKeysForMembers = Object.keys(userEventSchema.shape);
export const userEventKeysForTesting = [
    'role'
];
