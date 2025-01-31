import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user_wishlist')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'text', (c) => c.references('user.auth0_id').notNull())
    .addColumn('wishlist_id', 'integer', (c) => c.references('wishlist.id'))
    .addColumn('title', 'text', (c) => c.notNull())
    .addColumn('description', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint('unique_user_wishlist', ['user_id', 'wishlist_id'])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user_wishlist').execute()
}
