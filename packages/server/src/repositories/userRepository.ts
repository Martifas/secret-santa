import type { Database } from '@server/database'
import type { User } from '@server/database/types'
import { userKeysForMembers, type UserForMember } from '@server/entities/user'
import type { Insertable, Selectable } from 'kysely'

export function userRepository(db: Database) {
  return {
    async create(user: Insertable<User>): Promise<UserForMember> {
      return db
        .insertInto('user')
        .values(user)
        .returning(userKeysForMembers)
        .executeTakeFirstOrThrow()
    },
    async findByEmail(email: string): Promise<Selectable<User> | undefined> {
      const user = await db
        .selectFrom('user')
        .select(userKeysForMembers)
        .where('email', '=', email)
        .executeTakeFirst()

      return user
    },
  }
}
