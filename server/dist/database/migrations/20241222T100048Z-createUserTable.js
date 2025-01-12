import { sql } from 'kysely';
export async function up(db) {
    await db.schema
        .createTable('user')
        .addColumn('id', 'integer', (c) => c.primaryKey().generatedAlwaysAsIdentity())
        .addColumn('password', 'text', (c) => c.notNull())
        .addColumn('email', 'text', (c) => c.unique().notNull())
        .addColumn('created_at', 'timestamptz', (column) => column.defaultTo(sql `CURRENT_TIMESTAMP`).notNull())
        .addColumn('first_name', 'text')
        .addColumn('last_name', 'text')
        .addColumn('avatar_url', 'text')
        .addColumn('last_login', 'timestamptz', (column) => column.defaultTo(sql `CURRENT_TIMESTAMP`).notNull())
        .execute();
}
export async function down(db) {
    await db.schema.dropTable('user').execute();
}
