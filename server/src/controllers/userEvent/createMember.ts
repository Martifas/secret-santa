import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema } from '@server/entities/userEvent'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(
    userEventSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .mutation(async ({ input, ctx: { repos, authUser } }): Promise<number> => {
    const existingMembership =
      await repos.userEventRepository.findByEventAndUserId(
        input.eventId,
        authUser.auth0Id
      )

    if (existingMembership) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already a member of this event',
      })
    }

    const userEventId = await repos.userEventRepository.create(input)
    return userEventId
  })
