import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema } from '@server/entities/userEvent'

export default authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(
    userEventSchema.omit({
      wishlistId: true,
      santaForUserId: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<number> => {
    const createdId = await repos.userEventRepository.create(input)
    if (!createdId) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Error creating user event',
      })
    }

    return createdId
  })
