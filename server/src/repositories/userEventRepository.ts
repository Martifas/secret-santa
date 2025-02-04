import type { Database } from '@server/database'

import { userEventKeysForMembers } from '@server/entities/userEvent'
import type {
  SantaUserIdSelect,
  UserEventRowSelect,
  UserIdRowSelect,
} from '@server/types/userEvent'
import type { Insertable } from 'kysely'
import type { UserEvent } from '../database/types'
import type { UserEventForMember } from '../entities/userEvent'

export function userEventRepository(db: Database) {
  return {
    async getAllEventUsers(eventId: number): Promise<UserIdRowSelect[]> {
      return db
        .selectFrom('userEvent')
        .select('userId')
        .where('eventId', '=', eventId)
        .execute()
    },
    async findAllForUser(userId: string): Promise<UserEventForMember[]> {
      const result = await db
        .selectFrom('userEvent')
        .select(userEventKeysForMembers)
        .where('userId', '=', userId)
        .execute()
      return result
    },
    async updateSecretSanta(
      userId: string,
      santaForUserId: string,
      eventId: number
    ): Promise<SantaUserIdSelect> {
      return db
        .updateTable('userEvent')
        .set({ santaForUserId: santaForUserId, updatedAt: new Date() })
        .where('userId', '=', userId)
        .where('eventId', '=', eventId)
        .returning(['santaForUserId'])
        .executeTakeFirstOrThrow()
    },
    async findByEventAndUserId(
      eventId: number,
      userId: string
    ): Promise<UserEventRowSelect | null> {
      const result = await db
        .selectFrom('userEvent')
        .select(userEventKeysForMembers)
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result ?? null
    },
    async findBySantaId(userId: string, eventId: number): Promise<string | null> {
      const result = await db
        .selectFrom('userEvent')
        .select('userId')
        .where('santaForUserId', '=', userId)
        .where('eventId', '=', eventId)
        .executeTakeFirst()
      return result?.userId ?? null
    },
    async create(record: Insertable<UserEvent>): Promise<number> {
      const result = await db
        .insertInto('userEvent')
        .values(record)
        .returning('id')
        .executeTakeFirstOrThrow()
      return result.id
    },

    async updateWishlistId(
      id: number,
      wishlistId: number
    ): Promise<number | null> {
      const result = await db
        .updateTable('userEvent')
        .set({
          wishlistId: wishlistId,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returning('id')
        .executeTakeFirstOrThrow()
      return result.id
    },

    async isEventAdmin(userId: string, eventId: number): Promise<boolean> {
      const result = await db
        .selectFrom('userEvent')
        .select('id')
        .where('role', '=', 'admin')
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result !== undefined
    },

    async isMember(eventId: number, userId: string): Promise<boolean> {
      const result = await db
        .selectFrom('userEvent')
        .select('id')
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .where('role', 'in', ['member', 'admin'])
        .executeTakeFirst()
      return result !== undefined
    },

    async removeByEventId(eventId: number): Promise<number[]> {
      const result = await db
        .deleteFrom('userEvent')
        .where('eventId', '=', eventId)
        .returning('id')
        .execute()

      return result.map((row) => row.id)
    },
    async removeUserByEventId(
      eventId: number,
      userId: string
    ): Promise<number | null> {
      const result = await db
        .deleteFrom('userEvent')
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .returning('id')
        .execute()

      return result[0]?.id ?? null
    },
  }
}

export type UserEventRepository = ReturnType<typeof userEventRepository>
