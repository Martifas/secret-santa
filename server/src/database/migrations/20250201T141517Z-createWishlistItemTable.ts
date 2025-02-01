import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('wishlist')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'text', (c) =>
      c.references('user.auth0_id').notNull()
    )
    .addColumn('item_name', 'text', (c) => c.notNull())
    .addColumn('description', 'text')
    .addColumn('user_wishlist_id', 'integer', (c) =>
      c.references('user_wishlist.id').notNull()
    )
    .addColumn('price', 'real')
    .addColumn('created_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint('unique_wishlist_item', ['user_id', 'item_name'])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('wishlist').execute()
}
