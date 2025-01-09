import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import eventRouter from '..'

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })

  it('should create a new event', async () => {
    const newEventInput = {
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    }

    const expectedEventData = {
      ...newEventInput,
      createdBy: TEST_USER.id,
    }

    const createdEvent = {
      ...fakeEvent({
        id: 1,
        ...expectedEventData,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const repos = {
      eventRepository: {
        create: async (eventData: any) => {
          expect(eventData).toEqual(expectedEventData)
          return createdEvent
        },
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { createEvent } = createCaller(testContext)

    const result = await createEvent(newEventInput)

    expect(result).toMatchObject({
      id: expect.any(Number),
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: expect.any(Date),
      createdBy: TEST_USER.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should propagate repository errors', async () => {
    const newEventInput = {
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    }

    const repositoryError = new Error('Failed to create event')
    const repos = {
      eventRepository: {
        create: async () => {
          throw repositoryError
        },
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { createEvent } = createCaller(authRepoContext(repos, TEST_USER))
    await expect(createEvent(newEventInput)).rejects.toThrow(repositoryError)
  })
})
