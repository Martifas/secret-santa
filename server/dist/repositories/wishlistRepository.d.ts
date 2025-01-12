import type { Database, Wishlist } from '../database';
import { type WishlistForMember } from '../entities/wishlist';
import type { WishlistRowSelect, WishlistRowUpdate } from '../types/wishlist';
import type { Insertable } from 'kysely';
export declare function wishlistRepository(db: Database): {
    findById(id: number): Promise<WishlistRowSelect | null>;
    findByEventAndUserId(eventId: number, userId: number): Promise<WishlistRowSelect | null>;
    create(wishlist: Insertable<Wishlist>): Promise<WishlistForMember>;
    update(id: number, updates: WishlistRowUpdate): Promise<WishlistForMember>;
    remove(id: number): Promise<WishlistForMember>;
};
export type WishlistRepository = ReturnType<typeof wishlistRepository>;
//# sourceMappingURL=wishlistRepository.d.ts.map