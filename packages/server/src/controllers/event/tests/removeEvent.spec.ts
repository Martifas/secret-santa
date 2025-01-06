import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import eventRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123'
  })

  it('should remove an event when user is the creator', async () => {
    const id = 1
    const event = fakeEvent({
      id,
      createdBy: TEST_USER.id,
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    })

    const repos = {
      eventRepository: {
        find: async () => ({ ...event, createdAt: new Date(), updatedAt: new Date() }),
        remove: async (eventId: number) => {
          expect(eventId).toBe(id)
          return { ...event, createdAt: new Date(), updatedAt: new Date() }
        }
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { removeEvent } = createCaller(testContext)
    
    const result = await removeEvent({ id })
    
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

  it('should throw error when event not found', async () => {
    const repos = {
      eventRepository: {
        find: async () => null,
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { removeEvent } = createCaller(testContext)
    
    await expect(removeEvent({ id: 1 })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      })
    )
  })

  it('should throw error when user is not the creator', async () => {
    const id = 1
    const otherUserId = 999
    
    const event = fakeEvent({
      id,
      createdBy: otherUserId,
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
    })

    const repos = {
      eventRepository: {
        find: async () => ({ ...event, createdAt: new Date(), updatedAt: new Date() }),
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(eventRouter)
    const { removeEvent } = createCaller(testContext)
    
    await expect(removeEvent({ id })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to delete this event',
      })
    )
  })
})