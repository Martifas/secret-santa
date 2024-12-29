import type { Database } from '@server/database'
import { wishlistKeys } from '@server/entities/wishlist'
import type { WishlistRowSelect } from '@server/types/wishlist'

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
  }
}