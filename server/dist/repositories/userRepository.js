import { userKeysForMembers } from '../entities/user';
export function userRepository(db) {
    return {
        async create(user) {
            return db
                .insertInto('user')
                .values({
                ...user,
                createdAt: new Date(),
                lastLogin: new Date(),
            })
                .returning(userKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async findByEmail(email) {
            const user = await db
                .selectFrom('user')
                .select(userKeysForMembers)
                .where('email', '=', email)
                .executeTakeFirst();
            return user ?? null;
        },
        async findById(id) {
            const user = await db
                .selectFrom('user')
                .select(userKeysForMembers)
                .where('id', '=', id)
                .executeTakeFirst();
            return user ?? null;
        },
        async updateProfile(id, updates) {
            return db
                .updateTable('user')
                .set(updates)
                .where('id', '=', id)
                .returning(userKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async updateEmail(id, updates) {
            return db
                .updateTable('user')
                .set(updates)
                .where('id', '=', id)
                .returning(userKeysForMembers)
                .executeTakeFirstOrThrow();
        },
        async updateLastLogin(id) {
            return db
                .updateTable('user')
                .set({
                lastLogin: new Date(),
            })
                .where('id', '=', id)
                .returning(userKeysForMembers)
                .executeTakeFirstOrThrow();
        },
    };
}
