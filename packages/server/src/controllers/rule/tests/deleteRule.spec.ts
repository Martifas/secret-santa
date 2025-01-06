import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { RuleRepository } from '@server/repositories/ruleRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import ruleRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  
  const ruleId = 1
  const eventId = 100
  const removeInput = {
    id: ruleId,
    eventId,
  }
  
  const existingRule = {
    id: ruleId,
    eventId,
    ruleType: 'testRule',
    ruleData: { config: 'value' },
  }

  it('should remove rule when user is event admin', async () => {
    const repos = {
      ruleRepository: {
        remove: async (id) => {
          expect(id).toBe(ruleId)
          return existingRule
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { deleteRule } = createCaller(testContext)

    const result = await deleteRule(removeInput)
    expect(result).toEqual(existingRule)
  })

  it('should throw FORBIDDEN when user is not event admin', async () => {
    const repos = {
      ruleRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { deleteRule } = createCaller(testContext)

    await expect(deleteRule(removeInput)).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not an admin of this event',
      })
    )
  })

  it('should propagate unknown errors from remove', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        remove: async () => {
          throw unknownError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { deleteRule } = createCaller(testContext)

    await expect(deleteRule(removeInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from isEventAdmin check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        remove: async () => {
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
    const { deleteRule } = createCaller(testContext)

    await expect(deleteRule(removeInput)).rejects.toThrow(unknownError)
  })

  it('should throw when rule does not exist', async () => {
    const notFoundError = new Error('Rule not found')
    const repos = {
      ruleRepository: {
        remove: async () => {
          throw notFoundError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { deleteRule } = createCaller(testContext)

    await expect(deleteRule(removeInput)).rejects.toThrow(notFoundError)
  })
})