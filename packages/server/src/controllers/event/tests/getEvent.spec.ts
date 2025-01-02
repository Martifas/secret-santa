import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import eventRouter from '..'

const repos = {
  eventRepository: {
    find: async (id: number) => ({
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
      })
  } satisfies Partial<EventRepository>,
}

const createCaller = createCallerFactory(eventRouter)
const { getEvent } = createCaller(authRepoContext(repos))

describe('find', () => {
  it('should return an event', async () => {

    const id = 1

    const eventFound = await getEvent({ id })

    expect(eventFound).toMatchObject({
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