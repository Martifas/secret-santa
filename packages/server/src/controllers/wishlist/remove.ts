import provideRepos from '@server/trpc/provideRepos'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { wishlistSchema, type WishlistForMember } from '@server/entities/wishlist'

export default authenticatedProcedure
  .use(
    provideRepos({
      wishlistRepository,
    })
  )
  .input(
    wishlistSchema.pick({
      id: true,
    })
  )
  .mutation(
    async ({ input: { id }, ctx: { repos } }): Promise<WishlistForMember> => {
      const wishlist = await repos.wishlistRepository.remove(id)
      return wishlist
    }
  )
