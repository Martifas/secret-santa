import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlistItem'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      wishlistRepository,
    })
  )
  .input(
    wishlistSchema
      .pick({
        id: true,
        itemName: true,
        description: true,     
        price: true,
     
      })
      .partial({
        itemName: true,
        description: true,        
        price: true,    
        
      })
  )
  .mutation(
    async ({
      input: { id, ...updates },
      ctx: { repos, authUser },
    }): Promise<WishlistForMember> => {
      const existingWishlist = await repos.wishlistRepository.findById(id)

      if (!existingWishlist) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Wishlist item not found',
        })
      }

      if (existingWishlist.userId !== authUser.auth0Id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this wishlist item',
        })
      }

      const wishlist = await repos.wishlistRepository.update(id, updates)
      return wishlist
    }
  )
