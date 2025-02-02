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
    userEventSchema.pick({
      eventId: true,
    })
  )
  .query(async ({ input, ctx: { repos, authUser } }): Promise<boolean> => {
    if (!repos.userEventRepository) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'UserEventRepository not provided',
      })
    }

    return repos.userEventRepository.isEventAdmin(
      authUser.auth0Id,
      input.eventId
    )
  })