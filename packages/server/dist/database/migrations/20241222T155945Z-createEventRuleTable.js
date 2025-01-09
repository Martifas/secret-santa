import {} from 'kysely';
export async function up(db) {
    await db.schema
        .createTable('event_rule')
        .addColumn('id', 'integer', (c) => c.primaryKey().generatedAlwaysAsIdentity())
        .addColumn('event_id', 'integer', (c) => c.references('event.id').notNull())
        .addColumn('rule_type', 'text', (c) => c.notNull())
        .addColumn('rule_data', 'jsonb', (c) => c.notNull())
        .execute();
}
export async function down(db) {
    await db.schema.dropTable('event_rule').execute();
}
