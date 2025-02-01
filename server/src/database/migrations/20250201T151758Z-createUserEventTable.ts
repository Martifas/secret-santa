import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user_event')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'text', (c) => c.references('user.auth0_id').notNull())
    .addColumn('event_id', 'integer', (c) => c.references('event.id').notNull())
    .addColumn('role', 'text', (c) => c.notNull())
    .addColumn('event_title', 'text', (c) => c.notNull())
    .addColumn('wishlist_id', 'integer', (c) => c.references('userWishlist.id'))
    .addColumn('santa_for_user_id', 'text', (c) => c.references('user.auth0_id'))
    .addColumn('created_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint('unique_user_event', ['user_id', 'event_id'])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user_event').execute()
}
