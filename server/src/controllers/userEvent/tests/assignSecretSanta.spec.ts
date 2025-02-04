import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import type { EventRepository } from '@server/repositories/eventRepository'
import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'
import * as emailService from '@server/services/sendEmail'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@server/services/sendEmail', () => ({
  sendSecretSantaDrawResult: vi.fn(),
}))

describe('assignSecretSanta', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const eventId = 100
  const eventMembers = [
    { userId: 'auth0|123' },
    { userId: 'auth0|124' },
    { userId: 'auth0|125' },
    { userId: 'auth0|126' },
  ]

  const mockEvent = {
    id: eventId,
    title: 'Christmas Exchange',
    eventDate: new Date('2024-12-25'),
    budgetLimit: 50,
    createdBy: 'auth0|123',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    description: 'Nice Event',
  }

  const mockOrganizer = {
    firstName: 'John',
    email: 'john@example.com',
    picture: 'profile.jpg',
  }

  const mockUserDetails = {
    firstName: 'Test',
    email: 'test@example.com',
    picture: 'profile.jpg',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(emailService.sendSecretSantaDrawResult).mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
    })
  })

  it('should successfully assign secret santas and send emails', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
        updateSecretSanta: async (userId, santaId, eventId) => {
          expect(userId).toBeDefined()
          expect(santaId).toBeDefined()
          expect(eventId).toBe(eventId)
          return { santaForUserId: santaId }
        },
      } satisfies Partial<UserEventRepository>,
      eventRepository: {
        find: async (id) => {
          expect(id).toBe(eventId)
          return mockEvent
        },
      } satisfies Partial<EventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async (userId) => {
          expect(userId).toBeDefined()
          return mockUserDetails
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    const result = await assignSecretSanta({ eventId })
    expect(result).toEqual({
      message: `Secret santas for all ${eventMembers.length} members assigned`,
      success: true,
      totalAssignments: eventMembers.length,
      emailsSent: eventMembers.length,
    })
    expect(emailService.sendSecretSantaDrawResult).toHaveBeenCalledTimes(
      eventMembers.length
    )
  })

  it('should throw NOT_FOUND when event does not exist', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
      } satisfies Partial<UserEventRepository>,
      eventRepository: {
        find: async () => null,
      } satisfies Partial<EventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      })
    )
  })

  it('should throw NOT_FOUND when giftee name not found', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
        updateSecretSanta: async () => ({ santaForUserId: 'auth0|124' }),
      } satisfies Partial<UserEventRepository>,
      eventRepository: {
        find: async () => mockEvent,
      } satisfies Partial<EventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async (userId) => {
          if (userId === mockEvent.createdBy) {
            return mockOrganizer
          }
          return { ...mockUserDetails, firstName: null }
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: "Giftee's name not found for user auth0|124",
      })
    )
  })

  it('should handle email sending errors', async () => {
    const emailError = new Error('Failed to send email')
    vi.mocked(emailService.sendSecretSantaDrawResult).mockRejectedValue(
      emailError
    )

    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => eventMembers,
        updateSecretSanta: async () => ({ santaForUserId: 'auth0|124' }),
      } satisfies Partial<UserEventRepository>,
      eventRepository: {
        find: async () => mockEvent,
      } satisfies Partial<EventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => mockUserDetails,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(emailError)
  })

  it('should throw BAD_REQUEST when less than 3 members', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => [
          { userId: 'auth0|123' },
          { userId: 'auth0|124' },
        ],
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Not enough members to assign secret santas. Minimum 3 members required.',
      })
    )
  })

  it('should propagate unknown errors from repositories', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { assignSecretSanta } = createCaller(testContext)

    await expect(assignSecretSanta({ eventId })).rejects.toThrow(unknownError)
  })
})
