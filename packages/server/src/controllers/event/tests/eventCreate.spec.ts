import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeEvent } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import eventRouter from '..'

describe('create', () => {
  it('should create a new event', async () => {
  
    const newEventInput = {
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
      createdBy: 1
    }

    const createdEvent = {
      ...fakeEvent({
        id: 1,
        ...newEventInput
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const repos = {
      eventRepository: {
        create: async (eventData: any) => {
          expect(eventData).toEqual(newEventInput)
          return createdEvent
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { create } = createCaller(authRepoContext(repos))

    const result = await create(newEventInput)

    expect(result).toMatchObject({
      id: expect.any(Number),
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: expect.any(Date),
      createdBy: 1,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })


  it('should propagate repository errors', async () => {
  
    const newEventInput = {
      name: 'Christmas Party',
      description: 'Annual office party',
      budgetLimit: 50,
      status: 'draft',
      eventDate: new Date('2024-12-25'),
      createdBy: 1
    }
    
    const repositoryError = new Error('Failed to create event')
    
    const repos = {
      eventRepository: {
        create: async () => {
          throw repositoryError
        }
      } satisfies Partial<EventRepository>,
    }

    const createCaller = createCallerFactory(eventRouter)
    const { create } = createCaller(authRepoContext(repos))

    await expect(create(newEventInput)).rejects.toThrow(repositoryError)
  })

  
})