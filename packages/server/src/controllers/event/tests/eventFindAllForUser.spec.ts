import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import eventRouter from '..'

const repos = {
  eventRepository: {
    findAllForUser: async () => [
      {
        ...fakeEvent({
          id: 1,
          name: 'Christmas Party',
          description: 'Annual office party',
          budgetLimit: 50,
          status: 'draft',
          eventDate: new Date('2024-12-25'),
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...fakeEvent({
          id: 2,
          name: 'New Year Party',
          description: 'Welcome 2025!',
          budgetLimit: 100,
          status: 'draft',
          eventDate: new Date('2024-12-31'),
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  } satisfies Partial<EventRepository>,
}

const createCaller = createCallerFactory(eventRouter)
const { findAllForUser } = createCaller(authRepoContext(repos))

describe('findAll', () => {
  it('should return all events', async () => {
    // ACT (When)
    const events = await findAllForUser()

    // ASSERT (Then)
    expect(events).toHaveLength(2)
    expect(events).toMatchObject([
      {
        id: 1,
        name: 'Christmas Party',
        description: 'Annual office party',
        budgetLimit: 50,
        status: 'draft',
        eventDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: 2,
        name: 'New Year Party',
        description: 'Welcome 2025!',
        budgetLimit: 100,
        status: 'draft',
        eventDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])
  })
})
