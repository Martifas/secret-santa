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
      itemName: true,
      description: true,
      url: true,
      price: true,
      priority: true,
      isPurchased: true,
    }).partial({
      itemName: true,
      description: true,
      url: true,
      price: true,
      priority: true,
      isPurchased: true,
    })
  )
  .mutation(
    async ({ 
      input: { id, ...updates }, 
      ctx: { repos } 
    }): Promise<WishlistForMember> => {
      const wishlist = await repos.wishlistRepository.update(id, updates)
      return wishlist
    }
  )