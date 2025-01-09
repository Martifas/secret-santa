import { z } from 'zod';
import type { Selectable } from 'kysely';
import type { Wishlist } from '../database';
export declare const wishlistSchema: z.ZodObject<{
    id: z.ZodNumber;
    userId: z.ZodNumber;
    eventId: z.ZodNumber;
    itemName: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isPurchased: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    userId: number;
    itemName: string;
    isPurchased: boolean;
    description?: string | null | undefined;
    url?: string | null | undefined;
    price?: number | null | undefined;
    priority?: number | null | undefined;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    userId: number;
    itemName: string;
    description?: string | null | undefined;
    url?: string | null | undefined;
    price?: number | null | undefined;
    priority?: number | null | undefined;
    isPurchased?: boolean | undefined;
}>;
export declare const wishlistKeys: (keyof Wishlist)[];
export type WishlistForMember = Pick<Selectable<Wishlist>, (typeof wishlistKeys)[number]>;
export declare const wishlistKeysForTesting: readonly ["itemName", "description", "url", "price", "priority", "isPurchased"];
//# sourceMappingURL=wishlist.d.ts.map