import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { RuleRepository } from '@server/repositories/ruleRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import ruleRouter from '..'

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  
  const eventId = 100
  const newRuleInput = {
    eventId,
    ruleType: 'testRule',
    ruleData: { someConfig: 'value' },
  }
  
  const createdRule = {
    id: 1,
    ...newRuleInput,
  }

  it('should create a new rule when user is event admin', async () => {
    const repos = {
      ruleRepository: {
        create: async (input) => {
          expect(input).toEqual(newRuleInput)
          return createdRule
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { createRule } = createCaller(testContext)

    const result = await createRule(newRuleInput)
    expect(result).toMatchObject({
      id: expect.any(Number),
      eventId,
      ruleType: 'testRule',
      ruleData: { someConfig: 'value' },
    })
  })

  it('should throw FORBIDDEN when user is not event admin', async () => {
    const repos = {
      ruleRepository: {
        create: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { createRule } = createCaller(testContext)

    await expect(createRule(newRuleInput)).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not an admin of this event',
      })
    )
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        create: async () => {
          throw unknownError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { createRule } = createCaller(testContext)

    await expect(createRule(newRuleInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from isEventAdmin check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      ruleRepository: {
        create: async () => {
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
    const { createRule } = createCaller(testContext)

    await expect(createRule(newRuleInput)).rejects.toThrow(unknownError)
  })
})