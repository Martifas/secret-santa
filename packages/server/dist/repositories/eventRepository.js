import { eventKeysForMembers, } from '../entities/event';
export function eventRepository(db) {
    return {
        async findAll() {
            return db.selectFrom('event').select(eventKeysForMembers).execute();
        },
        async find(id) {
            const result = await db
                .selectFrom('event')
                .select(eventKeysForMembers)
                .where('id', '=', id)
                .executeTakeFirst();
            return result ?? null;
        },
        async create(event) {
            return db
                .insertInto('event')
                .values(event)
                .returning(eventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async update(id, updates) {
            return db
                .updateTable('event')
                .set({
                ...updates,
                updatedAt: new Date(),
            })
                .where('id', '=', id)
                .returning(eventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async remove(id) {
            return db
                .deleteFrom('event')
                .where('id', '=', id)
                .returning(eventKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async findAllForUser(userId) {
            return db
                .selectFrom('event')
                .leftJoin('userEvent', 'event.id', 'userEvent.eventId')
                .select([
                'event.id',
                'event.name',
                'event.description',
                'event.createdBy',
                'event.eventDate',
                'event.budgetLimit',
                'event.status',
                'event.createdAt',
                'event.updatedAt',
            ])
                .distinct()
                .where((eb) => eb.or([
                eb('event.createdBy', '=', userId),
                eb('userEvent.userId', '=', userId),
            ]))
                .execute();
        },
    };
}
