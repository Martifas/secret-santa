import { fakeUser } from '@server/entities/tests/fakes'
import type { RuleRepository } from '@server/repositories/ruleRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import ruleRouter from '..'

describe('update', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  const ruleId = 1
  const eventId = 100

  const updatedRule = {
    id: ruleId,
    eventId,
    ruleType: 'updatedRule',
    ruleData: { newConfig: 'newValue' },
  }

  it('should update rule with all fields when user is event admin', async () => {
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
      ruleData: { newConfig: 'newValue' },
    }

    const repos = {
      ruleRepository: {
        update: async (id, updates) => {
          expect(id).toBe(ruleId)
          expect(updates).toEqual({
            ruleType: updateInput.ruleType,
            ruleData: updateInput.ruleData,
          })
          return updatedRule
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { updateRule } = createCaller(testContext)

    const result = await updateRule(updateInput)
    expect(result).toEqual(updatedRule)
  })

  it('should update rule with partial fields when user is event admin', async () => {
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
    }

    const repos = {
      ruleRepository: {
        update: async (id, updates) => {
          expect(id).toBe(ruleId)
          expect(updates).toEqual({
            ruleType: updateInput.ruleType,
          })
          return updatedRule
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { updateRule } = createCaller(testContext)

    const result = await updateRule(updateInput)
    expect(result).toEqual(updatedRule)
  })

  it('should throw FORBIDDEN when user is not event admin', async () => {
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
    }

    const repos = {
      ruleRepository: {
        update: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { updateRule } = createCaller(testContext)

    await expect(updateRule(updateInput)).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Admin access required.',
      })
    )
  })

  it('should propagate unknown errors from update', async () => {
    const unknownError = new Error('Database connection failed')
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
    }

    const repos = {
      ruleRepository: {
        update: async () => {
          throw unknownError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { updateRule } = createCaller(testContext)

    await expect(updateRule(updateInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from isEventAdmin check', async () => {
    const unknownError = new Error('Database connection failed')
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
    }

    const repos = {
      ruleRepository: {
        update: async () => {
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
    const { updateRule } = createCaller(testContext)

    await expect(updateRule(updateInput)).rejects.toThrow(unknownError)
  })

  it('should throw when rule does not exist', async () => {
    const notFoundError = new Error('Rule not found')
    const updateInput = {
      id: ruleId,
      eventId,
      ruleType: 'updatedRule',
    }

    const repos = {
      ruleRepository: {
        update: async () => {
          throw notFoundError
        },
      } satisfies Partial<RuleRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(ruleRouter)
    const { updateRule } = createCaller(testContext)

    await expect(updateRule(updateInput)).rejects.toThrow(notFoundError)
  })
})
