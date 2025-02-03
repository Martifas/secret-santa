import { userEventSchema } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userRepository } from '@server/repositories/userRepository'
import { groupMemberProcedure } from '@server/trpc/groupMemberProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default groupMemberProcedure
  .use(
    provideRepos({
      userEventRepository,
      userRepository,
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
    }): Promise<{ firstName: string | null; santeeId: string }> => {
      const santeeId = await repos.userEventRepository.findBySantaId(
        authUser.auth0Id,
        eventId
      )

      if (!santeeId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No santees assigned for this user this event',
        })
      }

      const santaAssignment =
        await repos.userRepository.findNamePicEmailByAuth0Id(santeeId)

      if (!santaAssignment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No santa name found',
        })
      }

      return {
        firstName: santaAssignment.firstName,
        santeeId: santeeId,
      }
    }
  )
