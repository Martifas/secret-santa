import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  it('should remove an invitation when user is authorized', async () => {
    const id = 1
    const invitation = fakeEventInvitation({
      id,
      userId: TEST_USER.id,
      eventId: 123,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    })

    const repos = {
      invitationRepository: {
        findById: async () => ({
          ...invitation,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        remove: async (invitationId: number) => {
          expect(invitationId).toBe(id)
          return {
            ...invitation,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { deleteInvitation } = createCaller(testContext)

    const result = await deleteInvitation({ id })

    expect(result).toMatchObject({
      id,
      userId: TEST_USER.id,
      eventId: 123,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw error when invitation not found', async () => {
    const repos = {
      invitationRepository: {
        findById: async () => null,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { deleteInvitation } = createCaller(testContext)

    await expect(deleteInvitation({ id: 1 })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    )
  })

  it('should throw error when user is not authorized', async () => {
    const id = 1
    const otherUserId = 999
    const invitation = fakeEventInvitation({
      id,
      userId: otherUserId,
    })

    const repos = {
      invitationRepository: {
        findById: async () => ({
          ...invitation,
          expiresAt: new Date(invitation.expiresAt),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { deleteInvitation } = createCaller(testContext)

    await expect(deleteInvitation({ id })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to remove this invitation',
      })
    )
  })
})
