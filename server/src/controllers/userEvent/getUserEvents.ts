import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema, type UserEventForMember } from '@server/entities/userEvent'



export default authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(
    userEventSchema.pick({
      userId: true,
    })
  )
  .query(async ({ input, ctx: { repos } }): Promise<UserEventForMember[]> => {
    const result =
      await repos.userEventRepository.findAllForUser(input.userId)
    if (!result) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No events found for this user',
      })
    }

    return result
  })