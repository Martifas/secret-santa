import { wishlistKeys } from '../entities/wishlist';
export function wishlistRepository(db) {
    return {
        async findById(id) {
            const result = await db
                .selectFrom('wishlist')
                .select(wishlistKeys)
                .where('id', '=', id)
                .executeTakeFirst();
            return result ?? null;
        },
        async findByEventAndUserId(eventId, userId) {
            const result = await db
                .selectFrom('wishlist')
                .select(wishlistKeys)
                .where('eventId', '=', eventId)
                .where('userId', '=', userId)
                .executeTakeFirst();
            return result ?? null;
        },
        async create(wishlist) {
            return db
                .insertInto('wishlist')
                .values(wishlist)
                .returning(wishlistKeys)
                .executeTakeFirstOrThrow();
        },
        async update(id, updates) {
            return db
                .updateTable('wishlist')
                .set({
                ...updates,
                updatedAt: new Date(),
            })
                .where('id', '=', id)
                .returning(wishlistKeys)
                .executeTakeFirstOrThrow();
        },
        async remove(id) {
            return db
                .deleteFrom('wishlist')
                .where('id', '=', id)
                .returning(wishlistKeys)
                .executeTakeFirstOrThrow();
        },
    };
}
