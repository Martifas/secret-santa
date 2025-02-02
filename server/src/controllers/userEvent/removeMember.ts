import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import {
  userEventSchema,
  type UserEventForMember,
} from '@server/entities/userEvent'
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
      id: true,
      eventId: true,
    })
  )
  .mutation(
    async ({
      input,
      ctx: { repos, authUser },
    }): Promise<UserEventForMember> => {
      const userEvent = await repos.userEventRepository.findByEventAndUserId(
        input.id,
        authUser.auth0Id
      )
      if (!userEvent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User event membership not found',
        })
      }

      return repos.userEventRepository.remove(input.id)
    }
  )
