import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { wishlistSchema } from '@server/entities/wishlistItem'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      wishlistRepository,
    })
  )
  .input(
    wishlistSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<number> => {
    const existing = await repos.wishlistRepository.findByUserIdAndItem(
      input.userId,
      input.itemName
    )
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A wishlist item with this name already exists for this user',
      })
    }

    const wishlist = await repos.wishlistRepository.create(input)
    return wishlist.id
  })
