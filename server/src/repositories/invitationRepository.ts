import type { Database, EventInvitations } from '@server/database'
import {
  invitationKeysForMembers,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
import type {
  InvitationRowSelect,
  InvitationRowUpdate,
} from '@server/types/invitation'
import type { Insertable } from 'kysely'

export function invitationRepository(db: Database) {
  return {
    async findById(id: number): Promise<InvitationRowSelect | null> {
      const result = await db
        .selectFrom('eventInvitations')
        .select(invitationKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()
      return result ?? null
    },
    async findByEventAndEmail(
      eventId: number,
      email: string
    ): Promise<InvitationRowSelect | null> {
      const result = await db
        .selectFrom('eventInvitations')
        .select(invitationKeysForMembers)
        .where('eventId', '=', eventId)
        .where('email', '=', email)
        .executeTakeFirst()
      return result ?? null
    },
    async findPendingInvitationsForEvent(
      eventId: number
    ): Promise<InvitationForMember[]> {
      const results = await db
        .selectFrom('eventInvitations')
        .select(invitationKeysForMembers)
        .where('eventId', '=', eventId)
        .where('status', '=', 'sent')
        .execute()

      return results
    },
    async findAllForUser(userId: string): Promise<InvitationRowSelect[]> {
      return db
        .selectFrom('eventInvitations')
        .select(invitationKeysForMembers)
        .where('userId', '=', userId)
        .execute()
    },

    async create(invitation: Insertable<EventInvitations>): Promise<number> {
      const result = await db
        .insertInto('eventInvitations')
        .values(invitation)
        .returning('id')
        .executeTakeFirstOrThrow()
      return result.id
    },

    async update(
      id: number,
      updates: InvitationRowUpdate
    ): Promise<InvitationForMember> {
      return db
        .updateTable('eventInvitations')
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returning(invitationKeysForMembers)
        .executeTakeFirstOrThrow()
    },
    async updateStatus(id: number, status: string): Promise<number> {
      const result = await db
        .updateTable('eventInvitations')
        .set({
          status,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirstOrThrow()

      return result.id
    },

    async removeByEventId(eventId: number): Promise<number[]> {
      const result = await db
        .deleteFrom('eventInvitations')
        .where('eventId', '=', eventId)
        .returning('id')
        .execute()

      return result.map((row) => row.id)
    },
  }
}

export type InvitationRepository = ReturnType<typeof invitationRepository>
