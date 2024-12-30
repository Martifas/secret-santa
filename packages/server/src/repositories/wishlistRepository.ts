import type { Database, Wishlist } from '@server/database'
import { wishlistKeys, type WishlistForMember } from '@server/entities/wishlist'
import type { WishlistRowSelect, WishlistRowUpdate } from '@server/types/wishlist'
import type { Insertable } from 'kysely'

export function wishlistRepository(db: Database) {
  return {
    async findByEventAndUserId(
      eventId: number,
      userId: number
    ): Promise<WishlistRowSelect | null> {
      const result = await db
        .selectFrom('wishlist')
        .select(wishlistKeys)
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result ?? null
    },

    async create(wishlist: Insertable<Wishlist>): Promise<WishlistForMember> {
      return db
        .insertInto('wishlist')
        .values(wishlist)
        .returning(wishlistKeys)
        .executeTakeFirstOrThrow()
    },
    async update(id: number, updates: WishlistRowUpdate): Promise<WishlistForMember> {
          return db
            .updateTable('wishlist')
            .set({
              ...updates,
              updatedAt: new Date(),
            })
            .where('id', '=', id)
            .returning(wishlistKeys)
            .executeTakeFirstOrThrow()
        },
  }
}
