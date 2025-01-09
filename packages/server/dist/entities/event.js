import { z } from 'zod';
import { idSchema } from './shared';
export const eventSchema = z.object({
    id: idSchema,
    name: z.string().min(1),
    description: z.string().min(1),
    createdBy: idSchema,
    eventDate: z.string().transform(str => new Date(str)),
    budgetLimit: z.number().int().positive(),
    status: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const eventKeysForMembers = Object.keys(eventSchema.shape);
export const eventKeysForTesting = [
    'name',
    'description',
    'eventDate',
    'budgetLimit',
    'status',
];
