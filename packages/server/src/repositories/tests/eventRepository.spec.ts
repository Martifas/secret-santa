import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/record'
import { fakeEvent, fakeUser } from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { eventKeysForTesting } from '@server/entities/event'
import { eventRepository } from '../eventRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = eventRepository(db)
const [userOne] = await insertAll(db, 'user', [fakeUser(), fakeUser()])
// const [eventOne, eventTwo] = await insertAll(db, 'event', [
//   fakeEvent({ createdBy: userOne.id }),
//   fakeEvent({ createdBy: userOne.id }),
// ])

const fakeEventDefault = (event: Parameters<typeof fakeEvent>[0] = {}) =>
  fakeEvent({ createdBy: userOne.id, ...event })

describe('create', () => {
  it('should create a new event', async () => {
    const event = fakeEventDefault()

    const createdEvent = await repository.create(event)

    expect(createdEvent).toMatchObject({
      ...pick(event, eventKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update event attributes', async () => {
    const [event] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userOne.id }),
    ])

    const updates = {
      name: 'Updated Secret Santa',
      description: 'A very cozy xmas evening with gifts',
      budgetLimit: 150,
      eventDate: new Date('2024-12-24'),
      status: 'published',
    }

    const updatedEvent = await repository.update(event.id, updates)

    expect(pick(updatedEvent, eventKeysForTesting)).toEqual(
      pick(updates, eventKeysForTesting)
    )
    expect(updatedEvent.id).toBe(event.id)
    expect(updatedEvent.createdBy).toBe(event.createdBy)
    expect(updatedEvent.updatedAt).toBeInstanceOf(Date)
  })
})

describe('remove', () => {
  it('should remove event', async () => {
    const [event] = await insertAll(db, 'event', [fakeEventDefault()])

    const removedEvent = await repository.remove(event.id)

    expect(removedEvent).toEqual(pick(event, eventKeysForTesting))

    const result = await selectAll(db,'event')

    expect(result).toHaveLength(0)
  })
})
