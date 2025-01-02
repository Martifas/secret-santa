import type { Database } from '@server/database'
import type { User } from '@server/database/types'
import { userKeysForMembers, type UserForMember } from '@server/entities/user'
import type { Insertable } from 'kysely'

export function userRepository(db: Database) {
  return {
    async findOrCreateFromAuth0(
      auth0Id: string,
      email: string,
      profile?: {
        firstName?: string | null
        lastName?: string | null
        avatarUrl?: string | null
      }
    ): Promise<UserForMember> {
      const existingUser = await db
        .selectFrom('user')
        .select(userKeysForMembers)
        .where('auth0Id', '=', auth0Id)
        .executeTakeFirst()

      if (existingUser) {
        return db
          .updateTable('user')
          .set({
            lastLogin: new Date(),
            ...profile,
          })
          .where('id', '=', existingUser.id)
          .returning(userKeysForMembers)
          .executeTakeFirstOrThrow()
      }

      return db
        .insertInto('user')
        .values({
          auth0Id,
          email,
          createdAt: new Date(),
          lastLogin: new Date(),
          firstName: profile?.firstName ?? null,
          lastName: profile?.lastName ?? null,
          avatarUrl: profile?.avatarUrl ?? null,
        })
        .returning(userKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async create(user: Insertable<User>): Promise<UserForMember> {
      return db
        .insertInto('user')
        .values({
          ...user,
          createdAt: new Date(),
          lastLogin: new Date(),
        })
        .returning(userKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async findByEmail(email: string): Promise<UserForMember | null> {
      const user = await db
        .selectFrom('user')
        .select(userKeysForMembers)
        .where('email', '=', email)
        .executeTakeFirst()
      return user ?? null
    },

    async findById(id: number): Promise<UserForMember | null> {
      const user = await db
        .selectFrom('user')
        .select(userKeysForMembers)
        .where('id', '=', id)
        .executeTakeFirst()
      return user ?? null
    },

    async updateProfile(
      id: number,
      updates: {
        firstName?: string | null,
        lastName?: string | null,
        avatarUrl?: string | null,
      }
    ): Promise<UserForMember> {
      return db
        .updateTable('user')
        .set(updates)
        .where('id', '=', id)
        .returning(userKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async updateLastLogin(id: number): Promise<UserForMember> {
      return db
        .updateTable('user')
        .set({
          lastLogin: new Date(),
        })
        .where('id', '=', id)
        .returning(userKeysForMembers)
        .executeTakeFirstOrThrow()
    },

    async findByAuth0Id(auth0Id: string): Promise<UserForMember | null> {
      const user = await db
        .selectFrom('user')
        .select(userKeysForMembers)
        .where('auth0Id', '=', auth0Id)
        .executeTakeFirst()
      return user ?? null
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
