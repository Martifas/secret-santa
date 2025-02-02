import { userEventSchema } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
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
      input,
      ctx: { repos },
    }): Promise<{ firstName: string | null; picture: string | null }[]> => {
      const userIds = await repos.userEventRepository.getAllEventUsers(
        input.eventId
      )
      if (!userIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No users found for this event',
        })
      }

      const userInfos = await Promise.all(
        userIds.map(async (user) => {
          const userInfo = await repos.userRepository.findNameAndPicByAuth0Id(
            user.userId
          )
          return {
            firstName: userInfo?.firstName ?? 'Unknown User',
            picture: userInfo?.picture ?? null,
          }
        })
      )

      return userInfos
    }
  )
