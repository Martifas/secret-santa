import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('updateRole', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|89789',
  })

  const userEventId = 1
  const eventId = 100

  const existingUserEvent = {
    id: userEventId,
    eventId,
    userId: TEST_USER.auth0Id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 'auth0| 896',
    createdAt: new Date(),
    updatedAt: new Date(),
    eventTitle: 'New years',
  }

  const updateInput = {
    id: userEventId,
    role: 'event_admin',
    eventId,
  }

  it('should update role when user is group admin', async () => {
    const updatedUserEvent = {
      ...existingUserEvent,
      role: updateInput.role,
      updatedAt: new Date(),
    }

    const repos = {
      userEventRepository: {
        updateRole: async (id, updates) => {
          expect(id).toBe(userEventId)
          expect(updates).toEqual({ role: updateInput.role })
          return updatedUserEvent
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateMemberRole } = createCaller(testContext)

    const result = await updateMemberRole(updateInput)
    expect(result).toEqual(updatedUserEvent)
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        updateRole: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => null,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateMemberRole } = createCaller(testContext)

    await expect(updateMemberRole(updateInput)).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User event membership not found',
      })
    )
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        updateRole: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => {
          throw unknownError
        },
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateMemberRole } = createCaller(testContext)

    await expect(updateMemberRole(updateInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from updateRole', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        updateRole: async () => {
          throw unknownError
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateMemberRole } = createCaller(testContext)

    await expect(updateMemberRole(updateInput)).rejects.toThrow(unknownError)
  })
})
