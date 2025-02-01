import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import eventRouter from '..'
import type { EventRowUpdate } from '@server/types/event'
import type { UserEventRepository } from '@server/repositories/userEventRepository'

describe('update', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })

  const id = 1
  const baseEvent = {
    ...fakeEvent({
      id,
      createdBy: TEST_USER.auth0Id,
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should update an event with partial data when user is creator', async () => {
    const updates = {
      title: 'New Year Party',
      budgetLimit: 100,
    }

    const updatedEvent = {
      ...baseEvent,
      ...updates,
      updatedAt: new Date(),
    }

    const repos = {
      eventRepository: {
        find: async () => baseEvent,
        update: async (eventId: number, eventUpdates: EventRowUpdate) => {
          expect(eventId).toBe(id)
          expect(eventUpdates).toEqual(updates)
          return updatedEvent
        },
      } satisfies Partial<EventRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { updateEvent } = createCaller(testContext)

    const result = await updateEvent({ id, updates })

    expect(result).toMatchObject({
      id,
      title: 'New Year Party',
      description: 'Annual office party',
      budgetLimit: 100,
      status: 'draft',
      eventDate: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw NOT_FOUND when event does not exist', async () => {
    const updates = { title: 'New Year Party' }

    const repos = {
      eventRepository: {
        find: async () => null,
      } satisfies Partial<EventRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { updateEvent } = createCaller(testContext)

    await expect(updateEvent({ id, updates })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not the creator', async () => {
    const updates = { title: 'New Year Party' }
    const eventByAnotherUser = {
      ...baseEvent,
      createdBy: 'auth0|1258',
    }

    const repos = {
      eventRepository: {
        find: async () => eventByAnotherUser,
      } satisfies Partial<EventRepository>,
      userEventRepository: {
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { updateEvent } = createCaller(testContext)

    await expect(updateEvent({ id, updates })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Admin access required.',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const updates = { title: 'New Year Party' }
    const unknownError = new Error('Database connection failed')

    const repos = {
      eventRepository: {
        find: async () => baseEvent,
        update: async () => {
          throw unknownError
        },
      } satisfies Partial<EventRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { updateEvent } = createCaller(testContext)

    await expect(updateEvent({ id, updates })).rejects.toThrow(unknownError)
  })
})
