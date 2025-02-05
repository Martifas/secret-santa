import {
  userEventSchema,
  type UserEventForMember,
} from '@server/entities/userEvent'
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
      userId: true,
    })
  )
  .query(
    async ({
      input: { eventId, userId },
      ctx: { repos },
    }): Promise<UserEventForMember> => {
      const result = await repos.userEventRepository.findByEventAndUserId(
        eventId,
        userId
      )

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user event found',
        })
      }

      return result
    }
  )
