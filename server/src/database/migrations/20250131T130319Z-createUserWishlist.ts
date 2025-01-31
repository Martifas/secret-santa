import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user_wishlist')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('wishlist_id', 'integer', (c) => c.references('wishlist.id'))
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
