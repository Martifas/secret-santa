import {
  fakeEvent,
  fakeEventRule,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@server/utils/tests/database'
import { insertAll, selectAll } from '@server/utils/tests/record'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { ruleKeysForTesting } from '@server/entities/eventRule'
import { pick } from 'lodash-es'
import { ruleRepository } from '../ruleRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = ruleRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.auth0Id }),
])

const [ruleOne] = await insertAll(
  db,
  'eventRule',
  fakeEventRule({ eventId: eventOne.id })
)

const fakeRuleDefault = (rule: Parameters<typeof fakeEventRule>[0] = {}) =>
  fakeEventRule({ eventId: eventOne.id, ...rule })

describe('find event rules', () => {
  it('should return all rules by event id', async () => {
    const foundRules = await repository.findByEventId(eventOne.id)
    expect(foundRules).toHaveLength(1)

    const foundRule = foundRules[0]
    expect(pick(foundRule, ruleKeysForTesting)).toEqual(
      pick(ruleOne, ruleKeysForTesting)
    )
  })

  it('should return empty array when no rules exist', async () => {
    await db.deleteFrom('eventRule').execute()
    const rules = await repository.findByEventId(eventOne.id)
    expect(rules).toEqual([])
  })
})

describe('create', () => {
  it('should create a new rule', async () => {
    const rule = fakeRuleDefault()

    const createdRule = await repository.create(rule)

    expect(createdRule).toMatchObject({
      ...pick(rule, ruleKeysForTesting),
      id: expect.any(Number),
    })
  })
})

describe('update', () => {
  it('should update rule attributes', async () => {
    const updates = {
      ruleData: { message: 'No close family gifts' },
    }
    const updatedRule = await repository.update(ruleOne.id, updates)
    expect(pick(updatedRule, ruleKeysForTesting)).toEqual({
      ruleData: updates.ruleData,
      ruleType: ruleOne.ruleType,
    })
    expect(updatedRule.id).toBe(ruleOne.id)
  })

  it('should throw error when updating non-existent rule', async () => {
    const updates = {
      ruleData: { message: 'No handmade gifts' },
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('remove', () => {
  it('should remove rule', async () => {
    const removedRule = await repository.remove(ruleOne.id)
    expect(pick(removedRule, ruleKeysForTesting)).toEqual(
      pick(ruleOne, ruleKeysForTesting)
    )
    const result = await selectAll(db, 'eventRule')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent rule', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })
})
