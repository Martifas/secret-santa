import { type AuthUser } from '../entities/user';
import { z } from 'zod';
declare const tokenPayloadSchema: z.ZodObject<{
    user: z.ZodObject<Pick<{
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
}, "strip", z.ZodTypeAny, {
    user: {
        id: number;
    };
}, {
    user: {
        id: number;
    };
}>;
type TokenPayload = z.infer<typeof tokenPayloadSchema>;
export declare function prepareTokenPayload(user: AuthUser): TokenPayload;
export declare function parseTokenPayload(tokenVerified: unknown): TokenPayload;
export {};
//# sourceMappingURL=tokenPayload.d.ts.map