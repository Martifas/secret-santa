import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/record'
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
