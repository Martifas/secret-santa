import type { Database, EventInvitations } from '@server/database'
import { invitationKeysForMembers, type InvitationForMember } from '@server/entities/eventInvitation'
import type { InvitationRowSelect, InvitationRowUpdate } from '@server/types/invitation'
import type { Insertable } from 'kysely'

export function invitationRepository(db: Database) {
  return {
    async findByEventAndUserId(
      eventId: number,
      userId: number
    ): Promise<InvitationRowSelect | null> {
      const result = await db
        .selectFrom('eventInvitations')
        .select(invitationKeysForMembers)
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result ?? null
    },
    async findAll(): Promise<InvitationRowSelect[]> {
      return db.selectFrom('eventInvitations').select(invitationKeysForMembers).execute()
    },
    async create(invitation: Insertable<EventInvitations>): Promise<InvitationForMember> {
      return db
        .insertInto('eventInvitations')
        .values(invitation)
        .returning(invitationKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async update(id: number, updates: InvitationRowUpdate): Promise<InvitationForMember> {
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

    async remove(id: number): Promise<InvitationForMember> {
      return db
        .deleteFrom('eventInvitations')
        .where('id', '=', id)
        .returning(invitationKeysForMembers)
        .executeTakeFirstOrThrow()
    },
  }
}

export type InvitationRepository = ReturnType<typeof invitationRepository>