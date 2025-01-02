import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { wishlistSchema, type WishlistForMember } from '@server/entities/wishlist'
import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import { TRPCError } from '@trpc/server'

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
    async ({ input: { id }, ctx: { repos, authUser } }): Promise<WishlistForMember> => {
      const existingWishlist = await repos.wishlistRepository.findById(id)
     
      if (!existingWishlist) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Wishlist item not found',
        })
      }

      if (existingWishlist.userId !== authUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to remove this wishlist item',
        })
      }

      const wishlist = await repos.wishlistRepository.remove(id)
      return wishlist
    }
  )