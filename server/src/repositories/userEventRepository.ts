import type { Database } from '@server/database'

import { userEventKeysForMembers } from '@server/entities/userEvent'
import type {
  SantaUserIdSelect,
  UserEventRowSelect,
  UserEventRowUpdate,
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
      santaForUserId: string
    ): Promise<SantaUserIdSelect> {
      return db
        .updateTable('userEvent')
        .set({ santaForUserId: santaForUserId, updatedAt: new Date() })
        .where('userId', '=', userId)
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
    async findByEventId(eventId: number): Promise<UserEventForMember[]> {
      return db
        .selectFrom('userEvent')
        .where('eventId', '=', eventId)
        .selectAll()
        .execute()
    },
    async create(record: Insertable<UserEvent>): Promise<number> {
      const result = await db
        .insertInto('userEvent')
        .values(record)
        .returning('id')
        .executeTakeFirstOrThrow()
      return result.id
    },

    async updateRole(
      id: number,
      updates: UserEventRowUpdate
    ): Promise<UserEventForMember> {
      return db
        .updateTable('userEvent')
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returning(userEventKeysForMembers)
        .executeTakeFirstOrThrow()
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
  }
}

export type UserEventRepository = ReturnType<typeof userEventRepository>
