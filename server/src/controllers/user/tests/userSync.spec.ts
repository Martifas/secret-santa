import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import type { UserForMember } from '@server/entities/user'
import userSyncRouter from '..'

describe('userSync', () => {
  const testUserInput = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    auth0Id: 'auth0|123',
    picture: 'https://example.com/avatar.jpg'
  }

  const existingUser: UserForMember = {
    id: 1,
    ...testUserInput,
    createdAt: new Date(),
    lastLogin: new Date()
  }

  it('should create a new user when user does not exist', async () => {
    const createdId = 1
    const repos = {
      userRepository: {
        findByAuth0Id: async () => null,
        create: async (userData) => {
          expect(userData.email).toBe(testUserInput.email.toLowerCase())
          expect(userData.auth0Id).toBe(testUserInput.auth0Id)
          return createdId
        },
        findById: async (id) => ({
          ...existingUser,
          id
        }),
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userSyncRouter)
    const { userSync } = createCaller(testContext)

    const result = await userSync(testUserInput)
    expect(result).toEqual({ success: true, id: createdId })
  })

  it('should update lastLogin when user exists', async () => {
    let lastLoginUpdated = false
    const repos = {
      userRepository: {
        findByAuth0Id: async () => existingUser,
        updateLastLogin: async (id) => {
          expect(id).toBe(existingUser.id)
          lastLoginUpdated = true
          return existingUser
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userSyncRouter)
    const { userSync } = createCaller(testContext)

    const result = await userSync(testUserInput)
    expect(result).toEqual({ success: true, id: existingUser.id })
    expect(lastLoginUpdated).toBe(true)
  })

  it('should throw BAD_REQUEST when email already exists', async () => {
    const duplicateKeyError = new Error('duplicate key value violates unique constraint')
    const repos = {
      userRepository: {
        findByAuth0Id: async () => null,
        create: async () => {
          throw duplicateKeyError
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userSyncRouter)
    const { userSync } = createCaller(testContext)

    await expect(userSync(testUserInput)).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User with this email already exists',
        cause: duplicateKeyError,
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userRepository: {
        findByAuth0Id: async () => {
          throw unknownError
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userSyncRouter)
    const { userSync } = createCaller(testContext)

    await expect(userSync(testUserInput)).rejects.toThrow(unknownError)
  })

  it('should throw error if user creation fails', async () => {
    const repos = {
      userRepository: {
        findByAuth0Id: async () => null,
        create: async () => 1,
        findById: async () => null,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userSyncRouter)
    const { userSync } = createCaller(testContext)

    await expect(userSync(testUserInput)).rejects.toThrow('Failed to create user')
  })
})