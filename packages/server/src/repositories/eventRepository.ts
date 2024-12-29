import type { Database, Event } from '@server/database'
import {
  eventKeysForMembers,
  type EventForMember,
} from '@server/entities/event'
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
  }
}
