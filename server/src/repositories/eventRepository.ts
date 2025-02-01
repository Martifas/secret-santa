import type { Database, Event } from '@server/database'
import {
  eventKeysForMembers,
  type EventForMember,
} from '@server/entities/event'
import type { EventRowSelect, EventRowUpdate } from '@server/types/event'
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

    async update(id: number, updates: EventRowUpdate): Promise<EventForMember> {
      return db
        .updateTable('event')
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returning(eventKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async remove(id: number): Promise<EventForMember> {
      return db
        .deleteFrom('event')
        .where('id', '=', id)
        .returning(eventKeysForMembers)
        .executeTakeFirstOrThrow()
    },
  }
}

export type EventRepository = ReturnType<typeof eventRepository>
