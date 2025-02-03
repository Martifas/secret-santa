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
    }): Promise<string | null> => {
      const santaId = await repos.userEventRepository.findSanta(
        eventId,
        authUser.auth0Id
      )

      if (!santaId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No santa assignment found for this event',
        })
      }

      const santaName =
        await repos.userRepository.findNamePicEmailByAuth0Id(santaId)

      if (!santaName) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No santa name found',
        })
      }

      return santaName.firstName
    }
  )
