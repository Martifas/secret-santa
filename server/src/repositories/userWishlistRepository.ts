import type { Database, UserWishlist } from '@server/database'
import {
  userWishlistKeysForMembers,
  type UserWishlistForMember,
} from '@server/entities/userWishlist'
import type { UserWishlistRowUpdate } from '@server/types/userWishlist'
import type { Insertable } from 'kysely'

export function userWishlistRepository(db: Database) {
  return {
    async createPlaceholderWishlist(
      record: Insertable<UserWishlist>
    ): Promise<number> {
      const result = await db
        .insertInto('userWishlist')
        .values(record)
        .returning('id')
        .executeTakeFirstOrThrow()

      return result.id
    },

    async update(id: number, updates: UserWishlistRowUpdate): Promise<number> {
      const result = await db
        .updateTable('userWishlist')
        .set({ ...updates, updatedAt: new Date() })
        .where('id', '=', id)
        .returning('id')
        .executeTakeFirstOrThrow()
      return result.id
    },
    async find(id: number): Promise<UserWishlistForMember | null> {
      const result = await db
        .selectFrom('userWishlist')
        .select(userWishlistKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()
      return result ?? null
    },
  }
}
