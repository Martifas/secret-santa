import { z } from 'zod';
import { idSchema } from './shared';
export const userSchema = z.object({
    id: idSchema,
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must be at most 64 characters long'),
    email: z.string().email().trim(),
    createdAt: z.date(),
    firstName: z.string().min(1).optional().nullable(),
    lastName: z.string().min(1).optional().nullable(),
    avatarUrl: z.string().min(1).optional().nullable(),
    lastLogin: z.date().default(() => new Date()),
});
export const userKeysForMembers = Object.keys(userSchema.shape);
export const userKeysForTesting = [
    'username',
    'email',
    'firstName',
    'lastName',
    'avatarUrl',
];
export const authUserSchema = userSchema.pick({
    id: true,
});
