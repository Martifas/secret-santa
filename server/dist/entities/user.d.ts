import { z } from 'zod';
import type { User } from '../database/types';
import type { Selectable } from 'kysely';
export declare const userSchema: z.ZodObject<{
    id: z.ZodNumber;
    password: z.ZodString;
    email: z.ZodString;
    createdAt: z.ZodDate;
    firstName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lastLogin: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: number;
    password: string;
    email: string;
    createdAt: Date;
    lastLogin: Date;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}, {
    id: number;
    password: string;
    email: string;
    createdAt: Date;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    lastLogin?: Date | undefined;
}>;
export declare const userKeysForMembers: (keyof User)[];
export type UserForMember = Pick<Selectable<User>, (typeof userKeysForMembers)[number]>;
export declare const userKeysForTesting: readonly ["username", "email", "firstName", "lastName", "avatarUrl"];
export declare const authUserSchema: z.ZodObject<Pick<{
    id: z.ZodNumber;
    password: z.ZodString;
    email: z.ZodString;
    createdAt: z.ZodDate;
    firstName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lastLogin: z.ZodDefault<z.ZodDate>;
}, "id">, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export type AuthUser = z.infer<typeof authUserSchema>;
//# sourceMappingURL=user.d.ts.map