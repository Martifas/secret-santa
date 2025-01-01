import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import invitationRouter from '..'

const repos = {
  invitationRepository: {
    findAllForUser: async () => [
      {
        ...fakeEventInvitation({
          id: 1,
          email: 'user1@example.com',
          status: 'sent',
          eventId: 100,
          userId: 1,
          token: '123abc',
          expiresAt: new Date('2025-12-24'),
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...fakeEventInvitation({
          id: 2,
          email: 'user2@example.com',
          status: 'accepted',
          eventId: 101,
          userId: 1,
          token: '456def',
          expiresAt: new Date('2025-12-31'),
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  } satisfies Partial<InvitationRepository>,
}

const createCaller = createCallerFactory(invitationRouter)
const { findAllForUser } = createCaller(authRepoContext(repos))

describe('findAll', () => {
  it('should return all invitations', async () => {
    const invitations = await findAllForUser()

    expect(invitations).toHaveLength(2)
    expect(invitations).toMatchObject([
      {
        id: 1,
        email: 'user1@example.com',
        status: 'sent',
        eventId: 100,
        userId: 1,
        token: '123abc',
        expiresAt: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: 2,
        email: 'user2@example.com',
        status: 'accepted',
        eventId: 101,
        userId: 1,
        token: '456def',
        expiresAt: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])
  })
})