import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'
import type { EventRowUpdate } from '@server/types/event'
import type { UserEventRepository } from '@server/repositories/userEventRepository'

describe('update', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })

  const eventId = 123
  const baseInvitation = {
    ...fakeEventInvitation({
      id: 1,
      userId: TEST_USER.auth0Id,
      eventId,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should update an invitation when user is authorized', async () => {
    const updates = {
      email: 'test@example.com',
      eventId,
      status: 'confirmed',
    }

    const updatedInvitation = {
      ...baseInvitation,
      status: updates.status,
      updatedAt: new Date(),
    }

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => baseInvitation,
        update: async (invitationId: number, invitationUpdates: EventRowUpdate) => {
          expect(invitationId).toBe(baseInvitation.id)
          expect(invitationUpdates).toEqual({ 
            status: updates.status,
            userId: TEST_USER.auth0Id 
          })
          return updatedInvitation
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitation } = createCaller(testContext)

    const result = await updateInvitation(updates)

    expect(result).toMatchObject({
      id: baseInvitation.id,
      userId: TEST_USER.auth0Id,
      eventId,
      email: 'test@example.com',
      token: 'token123',
      status: 'confirmed',
      expiresAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw NOT_FOUND when invitation does not exist', async () => {
    const updates = {
      email: 'test@example.com',
      eventId,
      status: 'confirmed'
    }

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitation } = createCaller(testContext)

    await expect(updateInvitation(updates)).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const updates = {
      email: 'test@example.com',
      eventId,
      status: 'confirmed'
    }
    const unknownError = new Error('Database connection failed')

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => baseInvitation,
        update: async () => {
          throw unknownError
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitation } = createCaller(testContext)

    await expect(updateInvitation(updates)).rejects.toThrow(unknownError)
  })
})