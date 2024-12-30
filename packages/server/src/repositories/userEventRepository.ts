import type { Database } from '@server/database'
import { userEventKeysForMembers } from '@server/entities/userEvent'
import type { UserEventRowSelect, UserEventRowUpdate } from '@server/types/userEvent'
import type { Insertable } from 'kysely'
import type { UserEvent } from '../database/types';
import type { UserEventForMember } from '../entities/userEvent';

export function userEventRepository(db: Database) {
  return {
    async findByEventAndUserId(
      eventId: number,
      userId: number
    ): Promise<UserEventRowSelect | null> {
      const result = await db
        .selectFrom('userEvent')
        .select(userEventKeysForMembers)
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result ?? null
    },
    async create(
      record: Insertable<UserEvent>
    ): Promise<UserEventForMember> {
      return db
        .insertInto('userEvent')
        .values(record)
        .returning(userEventKeysForMembers)
        .executeTakeFirstOrThrow()
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

    async remove(id: number): Promise<UserEventForMember> {
      return db
        .deleteFrom('userEvent')
        .where('id', '=', id)
        .returning(userEventKeysForMembers)
        .executeTakeFirstOrThrow()
    },
  }
}
