import type { Database, Wishlist } from '@server/database'
import {
  wishlistKeys,
  type WishlistForMember,
} from '@server/entities/wishlistItem'
import type { WishlistRowSelect } from '@server/types/wishlist'
import type { Insertable } from 'kysely'

export function wishlistRepository(db: Database) {
  return {
    async findAllByUserIdAndUserWishlistId(
      userId: string,
      userWishlistId: number
    ): Promise<WishlistRowSelect[]> {
      const result = await db
        .selectFrom('wishlist')
        .select(wishlistKeys)
        .where('userId', '=', userId)
        .where('userWishlistId', '=', userWishlistId)
        .execute()

      return result
    },
    async findByItemAndUserWishlistId(
      itemName: string,
      userWishlistId: number
    ): Promise<WishlistRowSelect | null> {
      const result = await db
        .selectFrom('wishlist')
        .select(wishlistKeys)
        .where('itemName', '=', itemName)
        .where('userWishlistId', '=', userWishlistId)
        .executeTakeFirst()
      return result ?? null
    },

    async create(wishlist: Insertable<Wishlist>): Promise<WishlistRowSelect> {
      return db
        .insertInto('wishlist')
        .values(wishlist)
        .returning(wishlistKeys)
        .executeTakeFirstOrThrow()
    },

    async remove(id: number): Promise<WishlistForMember> {
      return db
        .deleteFrom('wishlist')
        .where('id', '=', id)
        .returning(wishlistKeys)
        .executeTakeFirstOrThrow()
    },
  }
}

export type WishlistRepository = ReturnType<typeof wishlistRepository>
