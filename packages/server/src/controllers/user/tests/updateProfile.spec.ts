import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import type { UserForMember } from '@server/entities/user'
import userRouter from '..'

describe('updateProfile', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const existingUser: UserForMember = {
    id: TEST_USER.id,
    auth0Id: TEST_USER.auth0Id,
    email: 'test@example.com',
    firstName: 'Old First',
    lastName: 'Old Last',
    avatarUrl: 'https://old-avatar.com',
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  const updateInput = {
    firstName: 'New First',
    lastName: 'New Last',
    avatarUrl: 'https://new-avatar.com',
  }

  it('should update user profile when user exists', async () => {
    const updatedUser: UserForMember = {
      ...existingUser,
      ...updateInput,
    }

    const repos = {
      userRepository: {
        findByAuth0Id: async () => existingUser,
        updateProfile: async (id, updates) => {
          expect(id).toBe(existingUser.id)
          expect(updates).toEqual(updateInput)
          return updatedUser
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userRouter)
    const { updateProfile } = createCaller(testContext)

    const result = await updateProfile(updateInput)

    expect(result).toEqual(updatedUser)
  })

  it('should allow partial updates', async () => {
    const partialUpdate = {
      firstName: 'New First',
    }

    const partiallyUpdatedUser: UserForMember = {
      ...existingUser,
      ...partialUpdate,
    }

    const repos = {
      userRepository: {
        findByAuth0Id: async () => existingUser,
        updateProfile: async (id, updates) => {
          expect(updates).toEqual(partialUpdate)
          return partiallyUpdatedUser
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userRouter)
    const { updateProfile } = createCaller(testContext)

    const result = await updateProfile(partialUpdate)

    expect(result).toEqual(partiallyUpdatedUser)
  })

  it('should throw NOT_FOUND when user does not exist', async () => {
    const repos = {
      userRepository: {
        findByAuth0Id: async () => null,
        updateProfile: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userRouter)
    const { updateProfile } = createCaller(testContext)

    await expect(updateProfile(updateInput)).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    )
  })

  it('should propagate unknown errors from findByAuth0Id', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userRepository: {
        findByAuth0Id: async () => {
          throw unknownError
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userRouter)
    const { updateProfile } = createCaller(testContext)

    await expect(updateProfile(updateInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from updateProfile', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userRepository: {
        findByAuth0Id: async () => existingUser,
        updateProfile: async () => {
          throw unknownError
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userRouter)
    const { updateProfile } = createCaller(testContext)

    await expect(updateProfile(updateInput)).rejects.toThrow(unknownError)
  })
})