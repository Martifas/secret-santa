import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import type { Insertable } from 'kysely'
import type { Event } from '@server/database'
import eventRouter from '..'

describe('create event', () => {
  const TEST_USER = fakeAuthUser({
    auth0Id: 'auth0|test123',
  })

  it('should create a new event and return its id', async () => {
    const newEventInput = {
      title: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'active',
      eventDate: new Date('2024-12-25'),
      createdBy: 'auth0|1234',
    }

    const expectedEventData = {
      ...newEventInput,
      createdBy: TEST_USER.auth0Id,
      status: 'active',
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
        create: async (eventData: Insertable<Event>) => {
          expect(eventData).toEqual(expectedEventData)
          return createdEvent.id
        },
        find: async (id: number) => {
          expect(id).toBe(createdEvent.id)
          return createdEvent
        },
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { createEvent } = createCaller(testContext)

    const result = await createEvent(newEventInput)
    expect(result).toBe(createdEvent.id)
  })

  it('should throw error when event creation fails', async () => {
    const newEventInput = {
      title: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'active',
      eventDate: new Date('2024-12-25'),
      createdBy: 'auth0|1234',
    }

    const repos = {
      eventRepository: {
        create: async () => {
          throw new Error('Database error')
        },
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { createEvent } = createCaller(authRepoContext(repos, TEST_USER))

    await expect(createEvent(newEventInput)).rejects.toThrow('Database error')
  })

  it('should throw error when created event cannot be found', async () => {
    const newEventInput = {
      title: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'active',
      eventDate: new Date('2024-12-25'),
      createdBy: 'auth0|1234',
    }

    const repos = {
      eventRepository: {
        create: async () => 1,
        find: async () => null,
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { createEvent } = createCaller(authRepoContext(repos, TEST_USER))

    await expect(createEvent(newEventInput)).rejects.toThrow(
      'Failed to create event'
    )
  })
})
