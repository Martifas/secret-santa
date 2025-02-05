import type { Database, UserWishlist } from '@server/database'
import {
  userWishlistKeysForMembers,
  type UserWishlistForMember,
} from '@server/entities/userWishlist'
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

    async find(id: number): Promise<UserWishlistForMember | null> {
      const result = await db
        .selectFrom('userWishlist')
        .select(userWishlistKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()
      return result ?? null
    },

    async findAllForUser(userId: string): Promise<UserWishlistForMember[]> {
      const result = await db
        .selectFrom('userWishlist')
        .select(userWishlistKeysForMembers)
        .where('userId', '=', userId)
        .execute()
      return result
    },
  }
}

export type UserWishlistRepository = ReturnType<typeof userWishlistRepository>