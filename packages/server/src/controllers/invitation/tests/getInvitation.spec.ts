import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'

describe('findById', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const id = 1
  const baseInvitation = {
    ...fakeEventInvitation({
      id,
      userId: TEST_USER.id,
      eventId: 123,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return an invitation when user is authorized', async () => {
    const repos = {
      invitationRepository: {
        findById: async () => baseInvitation,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getInvitation } = createCaller(testContext)

    const result = await getInvitation({ id })

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

  it('should throw NOT_FOUND when invitation does not exist', async () => {
    const repos = {
      invitationRepository: {
        findById: async () => null,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getInvitation } = createCaller(testContext)

    await expect(getInvitation({ id })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not authorized', async () => {
    const invitationByAnotherUser = {
      ...baseInvitation,
      userId: TEST_USER.id + 1,
    }

    const repos = {
      invitationRepository: {
        findById: async () => invitationByAnotherUser,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getInvitation } = createCaller(testContext)

    await expect(getInvitation({ id })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to view this invitation',
      })
    )
  })
})
