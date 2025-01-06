import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { RuleRepository } from '@server/repositories/ruleRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import ruleRouter from '..'

describe('findByEventId', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  
  const eventId = 100
  const queryInput = {
    eventId,
  }
  
  const existingRules = [
    {
      id: 1,
      eventId,
      ruleType: 'testRule1',
      ruleData: { config: 'value1' },
    },
    {
      id: 2,
      eventId,
      ruleType: 'testRule2',
      ruleData: { config: 'value2' },
    },
  ]

  it('should return rules when user is event admin', async () => {
    const repos = {
      ruleRepository: {
        findByEventId: async (id) => {
          expect(id).toBe(eventId)
          return existingRules
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { getEventRules } = createCaller(testContext)

    const result = await getEventRules(queryInput)
    expect(result).toEqual(existingRules)
  })

  it('should throw FORBIDDEN when user is not event admin', async () => {
    const repos = {
      ruleRepository: {
        findByEventId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { getEventRules } = createCaller(testContext)

    await expect(getEventRules(queryInput)).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not an admin of this event',
      })
    )
  })

  it('should propagate unknown errors from findByEventId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        findByEventId: async () => {
          throw unknownError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { getEventRules } = createCaller(testContext)

    await expect(getEventRules(queryInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from isEventAdmin check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        findByEventId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { getEventRules } = createCaller(testContext)

    await expect(getEventRules(queryInput)).rejects.toThrow(unknownError)
  })

  it('should return empty array when no rules exist', async () => {
    const repos = {
      ruleRepository: {
        findByEventId: async () => [],
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { getEventRules } = createCaller(testContext)

    const result = await getEventRules(queryInput)
    expect(result).toEqual([])
  })
})