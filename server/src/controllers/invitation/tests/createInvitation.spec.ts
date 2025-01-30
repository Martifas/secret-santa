import { fakeAuthUser, fakeEventInvitation } from '@server/entities/tests/fakes'
import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'
import type { UserEventRepository } from '@server/repositories/userEventRepository'

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })
  const eventId = 100
  const newInvitationInput = {
    eventId,
    email: 'ezys@miskas.lt',
    status: 'sent',
    expiresAt: new Date('2025-12-24'),
  }
  const createdInvitation = {
    ...fakeEventInvitation({
      id: 1,
      ...newInvitationInput,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should create a new invitation when one does not exist', async () => {
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
        create: async (input) => {
          expect(input).toEqual(newInvitationInput)
          return createdInvitation
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createInvitation } = createCaller(testContext)

    const result = await createInvitation(newInvitationInput)
    expect(result).toMatchObject({
      id: expect.any(Number),
      eventId,
      email: 'ezys@miskas.lt',
      status: 'sent',
      expiresAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw CONFLICT when wishlist item already exists for user and event', async () => {
    const existingInvitation = {
      ...createdInvitation,
      email: 'existing@miskas.lt',
    }
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => existingInvitation,
        create: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createInvitation } = createCaller(testContext)

    await expect(createInvitation(newInvitationInput)).rejects.toThrow(
      new TRPCError({
        code: 'CONFLICT',
        message:
          'An invitation with this name already exists for this event and user',
      })
    )
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
        create: async () => {
          throw unknownError
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createInvitation } = createCaller(testContext)

    await expect(createInvitation(newInvitationInput)).rejects.toThrow(
      unknownError
    )
  })

  it('should propagate unknown errors from findByEventAndEmail', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => {
          throw unknownError
        },
        create: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createInvitation } = createCaller(testContext)

    await expect(createInvitation(newInvitationInput)).rejects.toThrow(
      unknownError
    )
  })
})
