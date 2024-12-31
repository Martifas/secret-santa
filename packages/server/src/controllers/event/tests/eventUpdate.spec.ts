import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import eventRouter from '..'

describe('update', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123'
  })
  
  const id = 1
  const baseEvent = {
    ...fakeEvent({
      id,
      createdBy: TEST_USER.id,
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should update an event with partial data when user is creator', async () => {
    const updates = {
      name: 'New Year Party',
      budgetLimit: 100
    }

    const updatedEvent = {
      ...baseEvent,
      ...updates,
      updatedAt: new Date()
    }

    const repos = {
      eventRepository: {
        find: async () => baseEvent,
        update: async (eventId: number, eventUpdates: any) => {
          expect(eventId).toBe(id)
          expect(eventUpdates).toEqual(updates)
          return updatedEvent
        }
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(testContext)

    const result = await update({ id, updates })

    expect(result).toMatchObject({
      id,
      name: 'New Year Party',
      description: 'Annual office party',
      budgetLimit: 100,
      status: 'draft',
      eventDate: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should throw NOT_FOUND when event does not exist', async () => {
    const updates = { name: 'New Year Party' }
   
    const repos = {
      eventRepository: {
        find: async () => null,
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(testContext)

    await expect(update({ id, updates })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not the creator', async () => {
    const updates = { name: 'New Year Party' }
    const eventByAnotherUser = {
      ...baseEvent,
      createdBy: TEST_USER.id + 1,
    }
   
    const repos = {
      eventRepository: {
        find: async () => eventByAnotherUser,
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(testContext)

    await expect(update({ id, updates })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to update this event',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const updates = { name: 'New Year Party' }
    const unknownError = new Error('Database connection failed')
   
    const repos = {
      eventRepository: {
        find: async () => baseEvent,
        update: async () => {
          throw unknownError
        }
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(testContext)

    await expect(update({ id, updates })).rejects.toThrow(unknownError)
  })
})