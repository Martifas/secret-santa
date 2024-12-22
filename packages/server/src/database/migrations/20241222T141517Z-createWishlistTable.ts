import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('wishlist')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('event_id', 'integer', (c) => c.references('event.id').notNull())
    .addColumn('item_name', 'text', (c) => c.notNull())
    .addColumn('description', 'text')
    .addColumn('url', 'text')
    .addColumn('price', 'decimal')
    .addColumn('priority', 'integer')
    .addColumn('is_purchased', 'boolean', (c) => c.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint('unique_wishlist_item', [
      'user_id',
      'event_id',
      'item_name',
    ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('wishlist').execute()
}
