import type { Database, Event } from '@server/database'
import { eventKeysForMembers } from '@server/entities/event'
import type { EventRowSelect } from '@server/types/event'
import type { Insertable } from 'kysely'

export function eventRepository(db: Database) {
  return {
    async find(id: number): Promise<EventRowSelect | null> {
      const result = await db
        .selectFrom('event')
        .select(eventKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()

      return result ?? null
    },

    async create(event: Insertable<Event>): Promise<number> {
      const result = await db
        .insertInto('event')
        .values(event)
        .returning('id')
        .executeTakeFirstOrThrow()

      return result.id
    },

    async remove(id: number): Promise<number> {
      const result = await db
        .deleteFrom('event')
        .where('id', '=', id)
        .returning('id')
        .executeTakeFirstOrThrow()

      return result.id
    },
  }
}

export type EventRepository = ReturnType<typeof eventRepository>
