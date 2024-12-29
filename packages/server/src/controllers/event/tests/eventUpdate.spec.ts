import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import eventRouter from '..'

describe('update', () => {
  const id = 1
  const baseEvent = {
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

  it('should update an event with partial data', async () => {
 
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
        update: async (eventId: number, eventUpdates: any) => {
          expect(eventId).toBe(id)
          expect(eventUpdates).toEqual(updates)
          return updatedEvent
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(authRepoContext(repos))

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
        update: async () => {
          throw new Error('no result found')
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(authRepoContext(repos))


    await expect(update({ id, updates })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      })
    )
  })

  it('should propagate unknown errors', async () => {

    const updates = { name: 'New Year Party' }
    const unknownError = new Error('Database connection failed')
    
    const repos = {
      eventRepository: {
        update: async () => {
          throw unknownError
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { update } = createCaller(authRepoContext(repos))

    await expect(update({ id, updates })).rejects.toThrow(unknownError)
  })
})