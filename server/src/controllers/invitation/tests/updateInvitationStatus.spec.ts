import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { fakeEventInvitation } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'

describe('updateInvitationStatus', () => {
  const id = 1
  const baseInvitation = {
    ...fakeEventInvitation({
      id,
      userId: 'auth0|123',
      eventId: 123,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should update invitation status when invitation exists', async () => {
    const newStatus = 'confirmed'
    const updatedId = 1

    const repos = {
      invitationRepository: {
        findById: async () => baseInvitation,
        updateStatus: async (invitationId: number, status: string) => {
          expect(invitationId).toBe(id)
          expect(status).toBe(newStatus)
          return updatedId
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitationStatus } = createCaller(testContext)

    const result = await updateInvitationStatus({
      id,
      status: newStatus,
    })

    expect(result).toBe(updatedId)
  })

  it('should throw NOT_FOUND when invitation does not exist', async () => {
    const repos = {
      invitationRepository: {
        findById: async () => null,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitationStatus } = createCaller(testContext)

    await expect(
      updateInvitationStatus({
        id,
        status: 'confirmed',
      })
    ).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    )
  })

  it('should propagate repository errors', async () => {
    const expectedError = new Error('Database connection failed')

    const repos = {
      invitationRepository: {
        findById: async () => baseInvitation,
        updateStatus: async () => {
          throw expectedError
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(invitationRouter)
    const { updateInvitationStatus } = createCaller(testContext)

    await expect(
      updateInvitationStatus({
        id,
        status: 'confirmed',
      })
    ).rejects.toThrow(expectedError)
  })
})