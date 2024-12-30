import type { Database } from '@server/database'
import { invitationKeys } from '@server/entities/eventInvitation'
import type { InvitationRowSelect } from '@server/types/invitation'

export function invitationRepository(db: Database) {
  return {
    async findByEventAndUserId(
      eventId: number,
      userId: number
    ): Promise<InvitationRowSelect | null> {
      const result = await db
        .selectFrom('eventInvitations')
        .select(invitationKeys)
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()
      return result ?? null
    },
     async findAll(): Promise<InvitationRowSelect[]> {
          return db.selectFrom('eventInvitations').select(invitationKeys).execute()
        },
  }
}
