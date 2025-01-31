import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userWishlistRepository } from '@server/repositories/userWishlistRepository'
import { userWishlistSchema } from '@server/entities/userWishlist'

export default authenticatedProcedure
  .use(
    provideRepos({
      userWishlistRepository,
    })
  )
  .input(
    userWishlistSchema.pick({
      title: true,
      userId: true,
      description: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<number> => {
    const createdId =
      await repos.userWishlistRepository.createPlaceholderWishlist(input)
    if (!createdId) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Error creating wishlist',
      })
    }

    return createdId
  })
