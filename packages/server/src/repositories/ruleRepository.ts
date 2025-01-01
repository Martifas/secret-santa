import type { Database, EventRule } from '@server/database'
import {
  ruleKeysForMembers,
  type RuleForMember,
} from '@server/entities/eventRule'
import type { RuleRowSelect, RuleRowUpdate } from '@server/types/rule'
import type { Insertable } from 'kysely'

export function ruleRepository(db: Database) {
  return {
    async findByEventId(eventId: number): Promise<RuleRowSelect[]> {
      return db
        .selectFrom('eventRule')
        .select(ruleKeysForMembers)
        .where('eventId', '=', eventId)
        .execute()
    },
    async create(rule: Insertable<EventRule>): Promise<RuleForMember> {
      return db
        .insertInto('eventRule')
        .values(rule)
        .returning(ruleKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async update(id: number, updates: RuleRowUpdate): Promise<RuleForMember> {
      return db
        .updateTable('eventRule')
        .set({
          ...updates,
        })
        .where('id', '=', id)
        .returning(ruleKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async remove(id: number): Promise<RuleForMember> {
      return db
        .deleteFrom('eventRule')
        .where('id', '=', id)
        .returning(ruleKeysForMembers)
        .executeTakeFirstOrThrow()
    },
  }
}

export type RuleRepository = ReturnType<typeof ruleRepository>
