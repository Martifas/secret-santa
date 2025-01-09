import { userEventKeysForMembers } from '../entities/userEvent';
export function userEventRepository(db) {
    return {
        async findByEventAndUserId(eventId, userId) {
            const result = await db
                .selectFrom('userEvent')
                .select(userEventKeysForMembers)
                .where('eventId', '=', eventId)
                .where('userId', '=', userId)
                .executeTakeFirst();
            return result ?? null;
        },
        async create(record) {
            return db
                .insertInto('userEvent')
                .values(record)
                .returning(userEventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async updateRole(id, updates) {
            return db
                .updateTable('userEvent')
                .set({
                ...updates,
                updatedAt: new Date(),
            })
                .where('id', '=', id)
                .returning(userEventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async isEventAdmin(userId, eventId) {
            const result = await db
                .selectFrom('userEvent')
                .select('id')
                .where('role', '=', 'event_admin')
                .where('eventId', '=', eventId)
                .where('userId', '=', userId)
                .executeTakeFirst();
            return result !== undefined;
        },
        async isMember(eventId, userId) {
            const result = await db
                .selectFrom('userEvent')
                .select('id')
                .where('eventId', '=', eventId)
                .where('userId', '=', userId)
                .executeTakeFirst();
            return result !== undefined;
        },
        async remove(id) {
            return db
                .deleteFrom('userEvent')
                .where('id', '=', id)
                .returning(userEventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
    };
}
