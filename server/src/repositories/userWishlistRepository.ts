import type { Database, UserWishlist } from '@server/database'
import type { Insertable } from 'kysely'

export function userWishlistRepository(db: Database) {
  return {
    async createPlaceholderWishlist(record: Insertable<UserWishlist>): Promise<number> {
      const result = await db
        .insertInto('userWishlist')
        .values(record)
        .returning('id')
        .executeTakeFirstOrThrow()

      return result.id
    },
  }
}