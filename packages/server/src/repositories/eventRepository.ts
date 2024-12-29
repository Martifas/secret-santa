import type { Database, Event } from '@server/database'
import {
  eventKeysForMembers,
  type EventForMember,
} from '@server/entities/event'
import type { EventRowUpdate } from '@server/types/event'
import type { Insertable } from 'kysely'

export function eventRepository(db: Database) {
  return {
    async create(event: Insertable<Event>): Promise<EventForMember> {
      return db
        .insertInto('event')
        .values(event)
        .returning(eventKeysForMembers)
        .executeTakeFirstOrThrow()
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
      }
  }
}
