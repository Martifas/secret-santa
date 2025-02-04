import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import invitationRouter from '..'

describe('findPendingInvitations', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })

  const eventId = 123
  const baseInvitations = [
    {
      ...fakeEventInvitation({
        id: 1,
        userId: TEST_USER.auth0Id,
        eventId,
        email: 'test1@example.com',
        token: 'token123',
        status: 'sent',
        expiresAt: new Date('2024-12-25'),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ...fakeEventInvitation({
        id: 2,
        userId: TEST_USER.auth0Id,
        eventId,
        email: 'test2@example.com',
        token: 'token456',
        status: 'pending',
        expiresAt: new Date('2024-12-25'),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should return pending invitations for an event', async () => {
    const repos = {
      invitationRepository: {
        findPendingInvitationsForEvent: async (eventId: number) => {
          expect(eventId).toBe(123)
          return baseInvitations
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getPendingInvitations } = createCaller(testContext)

    const result = await getPendingInvitations({ eventId })

    expect(result).toHaveLength(2)
    expect(result).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          email: 'test1@example.com',
          status: 'sent',
        }),
        expect.objectContaining({
          id: 2,
          email: 'test2@example.com',
          status: 'pending',
        }),
      ])
    )
  })

  it('should return empty array when no pending invitations exist', async () => {
    const repos = {
      invitationRepository: {
        findPendingInvitationsForEvent: async () => [],
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getPendingInvitations } = createCaller(testContext)

    const result = await getPendingInvitations({ eventId })

    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  })

  it('should propagate repository errors', async () => {
    const expectedError = new Error('Database connection failed')
    
    const repos = {
      invitationRepository: {
        findPendingInvitationsForEvent: async () => {
          throw expectedError
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getPendingInvitations } = createCaller(testContext)

    await expect(getPendingInvitations({ eventId })).rejects.toThrow(expectedError)
  })
})