import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  it('should remove an invitation when user is authorized', async () => {
    const id = 1
    const invitation = fakeEventInvitation({
      id,
      userId: TEST_USER.auth0Id,
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
        removeById: async (invitationId: number) => {
          expect(invitationId).toBe(id)
          return id
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { deleteInvitation } = createCaller(testContext)

    const result = await deleteInvitation({ id })
    expect(result).toBe(id)
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
})
