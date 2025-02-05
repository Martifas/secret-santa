import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema } from '@server/entities/userEvent'
import { TRPCError } from '@trpc/server'
import { groupMemberProcedure } from '@server/trpc/groupMemberProcedure'

export default groupMemberProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(
    userEventSchema.pick({
      eventId: true,
      wishlistId: true,
    })
  )
  .mutation(
    async ({ input, ctx: { repos, authUser } }): Promise<number | null> => {
      const userEvent = await repos.userEventRepository.findByEventAndUserId(
        input.eventId,
        authUser.auth0Id
      )

      if (!userEvent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User event membership not found',
        })
      }

      return repos.userEventRepository.updateWishlistId(
        userEvent.id,
        input.wishlistId
      )
    }
  )
