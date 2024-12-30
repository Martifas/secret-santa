import {
  fakeEvent,
  fakeEventRule,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/record'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { ruleKeysForTesting } from '@server/entities/eventRule'
import { pick } from 'lodash-es'
import { ruleRepository } from '../ruleRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = ruleRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.id }),
])

const [ruleOne] = await insertAll(
  db,
  'eventRule',
  fakeEventRule({ eventId: eventOne.id })
)

const fakeRuleDefault = (rule: Parameters<typeof fakeEventRule>[0] = {}) =>
  fakeEventRule({ eventId: eventOne.id, ...rule })

describe('find all', () => {
  it('should return all rules', async () => {
    const [userTwo] = await insertAll(db, 'user', [fakeUser()])
    const [eventTwo] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userTwo.id }),
    ])
    const [ruleTwo] = await insertAll(
      db,
      'eventRule',
      fakeEventRule({ eventId: eventTwo.id })
    )

    const rules = await repository.findAll()

    expect(rules).toHaveLength(2)
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining(pick(ruleOne, ruleKeysForTesting)),
        expect.objectContaining(pick(ruleTwo, ruleKeysForTesting)),
      ])
    )
  })

  it('should return empty array when no events exist', async () => {
    await db.deleteFrom('eventRule').execute()

    const rules = await repository.findAll()

    expect(rules).toEqual([])
  })
})

describe('find', () => {
  it('should return a rule by id', async () => {
    const foundRule = await repository.find(ruleOne.id)

    expect(foundRule).not.toBeNull()
    if (!foundRule) throw new Error('No rule found')

    expect(pick(foundRule, ruleKeysForTesting)).toEqual(
      pick(ruleOne, ruleKeysForTesting)
    )
  })

  it('should return null for non-existent rule', async () => {
    const foundRule = await repository.find(99999)
    expect(foundRule).toBeNull()
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
