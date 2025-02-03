import { userEventSchema, type UserEventForMember } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { groupMemberProcedure } from '@server/trpc/groupMemberProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default groupMemberProcedure
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
  .query(
    async ({
      input: { eventId },
      ctx: { repos, authUser },
    }): Promise<UserEventForMember> => {
      const result = await repos.userEventRepository.findByEventAndUserId(eventId, authUser.auth0Id)

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user event found',
        })
      }

      return result
    }
  )
