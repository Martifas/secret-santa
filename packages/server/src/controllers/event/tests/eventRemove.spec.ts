import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import eventRouter from '..'

describe('remove', () => {
  it('should remove an event', async () => {
    // ARRANGE (Given)
    const id = 1
    const removedEvent = {
      ...fakeEvent({
        id,
        name: 'Christmas Party',
        description: 'Annual office party',
        budgetLimit: 50,
        status: 'draft',
        eventDate: new Date('2024-12-25'),
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const repos = {
      eventRepository: {
        remove: async (eventId: number) => {
          expect(eventId).toBe(id)
          return removedEvent
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { remove } = createCaller(authRepoContext(repos))

    // ACT (When)
    const result = await remove({ id })

    // ASSERT (Then)
    expect(result).toMatchObject({
      id,
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})