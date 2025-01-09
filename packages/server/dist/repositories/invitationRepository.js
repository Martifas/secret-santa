import { invitationKeysForMembers, } from '../entities/eventInvitation';
export function invitationRepository(db) {
    return {
        async findById(id) {
            const result = await db
                .selectFrom('eventInvitations')
                .select(invitationKeysForMembers)
                .where('id', '=', id)
                .executeTakeFirst();
            return result ?? null;
        },
        async findByEventAndUserId(eventId, userId) {
            const result = await db
                .selectFrom('eventInvitations')
                .select(invitationKeysForMembers)
                .where('eventId', '=', eventId)
                .where('userId', '=', userId)
                .executeTakeFirst();
            return result ?? null;
        },
        async findAllForUser(userId) {
            return db
                .selectFrom('eventInvitations')
                .select(invitationKeysForMembers)
                .where('userId', '=', userId)
                .execute();
        },
        async create(invitation) {
            return db
                .insertInto('eventInvitations')
                .values(invitation)
                .returning(invitationKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async update(id, updates) {
            return db
                .updateTable('eventInvitations')
                .set({
                ...updates,
                updatedAt: new Date(),
            })
                .where('id', '=', id)
                .returning(invitationKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async remove(id) {
            return db
                .deleteFrom('eventInvitations')
                .where('id', '=', id)
                .returning(invitationKeysForMembers)
                .executeTakeFirstOrThrow();
        },
    };
}
