import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema } from '@server/entities/userEvent'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

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
  .mutation(async ({ input, ctx: { repos } }): Promise<number[]> => {
    try {
      const userEvents = await repos.userEventRepository.findByEventId(
        input.eventId
      )

      if (!userEvents.length) {
        return []
      }

      return repos.userEventRepository.removeByEventId(input.eventId)
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove user events',
        cause: error,
      })
    }
  })
