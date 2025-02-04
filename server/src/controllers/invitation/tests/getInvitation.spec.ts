import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'
import type { UserEventRepository } from '@server/repositories/userEventRepository'

describe('findById', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })

  const id = 1
  const baseInvitation = {
    ...fakeEventInvitation({
      id,
      userId: TEST_USER.auth0Id,
      eventId: 123,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return an invitation when user is authorized group admin', async () => {
    const repos = {
      invitationRepository: {
        findById: async () => baseInvitation,
        findByEventAndEmail: async () => baseInvitation ,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getInvitation } = createCaller(testContext)

    const result = await getInvitation({
      eventId: baseInvitation.eventId,
      email: baseInvitation.email,
    })

    expect(result).toMatchObject({
      id,
      userId: TEST_USER.auth0Id,
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
        findByEventAndEmail: async () => null,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { getInvitation } = createCaller(testContext)

    await expect(
      getInvitation({
        eventId: baseInvitation.eventId,
        email: baseInvitation.email,
      })
    ).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    )
  })
})
