import { ruleKeysForMembers, } from '../entities/eventRule';
export function ruleRepository(db) {
    return {
        async findByEventId(eventId) {
            return db
                .selectFrom('eventRule')
                .select(ruleKeysForMembers)
                .where('eventId', '=', eventId)
                .execute();
        },
        async create(rule) {
            return db
                .insertInto('eventRule')
                .values(rule)
                .returning(ruleKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async update(id, updates) {
            return db
                .updateTable('eventRule')
                .set({
                ...updates,
            })
                .where('id', '=', id)
                .returning(ruleKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async remove(id) {
            return db
                .deleteFrom('eventRule')
                .where('id', '=', id)
                .returning(ruleKeysForMembers)
                .executeTakeFirstOrThrow();
        },
    };
}
