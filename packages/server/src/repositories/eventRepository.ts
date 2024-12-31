import type { Database, Event } from '@server/database'
import {
  eventKeysForMembers,
  type EventForMember,
} from '@server/entities/event'
import type { EventRowSelect, EventRowUpdate } from '@server/types/event'
import type { Insertable } from 'kysely'

export function eventRepository(db: Database) {
  return {
    async findAll(): Promise<EventRowSelect[]> {
      return db.selectFrom('event').select(eventKeysForMembers).execute()
    },

    async find(id: number): Promise<EventRowSelect | null> {
      const result = await db
        .selectFrom('event')
        .select(eventKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()

      return result ?? null
    },

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
    },

    async isMember(eventId: number, userId: number): Promise<boolean> {
      const result = await db
        .selectFrom('userEvent')
        .select('id')
        .where('eventId', '=', eventId)
        .where('userId', '=', userId)
        .executeTakeFirst()

      return result !== undefined
    },
    async findAllForUser(userId: number): Promise<EventRowSelect[]> {
      return db
        .selectFrom('event')
        .leftJoin('userEvent', 'event.id', 'userEvent.eventId')
        .select([
          'event.id',
          'event.name',
          'event.description',
          'event.createdBy',
          'event.eventDate',
          'event.budgetLimit',
          'event.status',
          'event.createdAt',
          'event.updatedAt',
        ])
        .distinct()
        .where((eb) =>
          eb.or([
            eb('event.createdBy', '=', userId),
            eb('userEvent.userId', '=', userId),
          ])
        )
        .execute()
    },
  }
}

export type EventRepository = ReturnType<typeof eventRepository>
