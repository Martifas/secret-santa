import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('getSecretSanta', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })
  const eventId = 100
  const eventMembers = [
    { userId: 1 },
    { userId: 2 },
    { userId: 3 },
    { userId: 4 },
  ]

  it('should successfully assign secret santas when enough members', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
        isEventAdmin: async () => true,
        updateSecretSanta: async (userId, santaForUserId) => {
          expect(userId).toBeDefined()
          expect(santaForUserId).toBeDefined()
          return { santaForUserId }
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    const result = await assignSecretSanta({ eventId })
    expect(result).toBe(
      `Secret santas for all ${eventMembers.length} members assigned`
    )
  })

  it('should throw BAD_REQUEST when less than 3 members', async () => {
    const repos = {
      userEventRepository: {
        isEventAdmin: async () => true,
        getAllEventUsers: async () => [{ userId: 1 }, { userId: 2 }],
        updateSecretSanta: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Not enough members to assign secret santas. Minimum 3 members required.',
      })
    )
  })

  it('should propagate unknown errors from getAllEventUsers', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isEventAdmin: async () => true,
        getAllEventUsers: async () => {
          throw unknownError
        },
        updateSecretSanta: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from updateSecretSanta', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
        isEventAdmin: async () => true,
        updateSecretSanta: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(unknownError)
  })

  it('should throw FORBIDDEN when user is not an admin', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => {
          throw new Error('Should not be called')
        },
        updateSecretSanta: async () => {
          throw new Error('Should not be called')
        },
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Admin access required.',
      })
    )
  })
})
