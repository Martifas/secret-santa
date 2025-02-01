import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
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
      userEventRepository,
    })
  )
  .input(
    wishlistSchema.pick({
      userId: true,
      userWishlistId: true,
    })
  )
  .query(async ({ input, ctx: { repos } }): Promise<WishlistForMember[]> => {
    const result =
      await repos.wishlistRepository.findAllByUserIdAndUserWishlistId(
        input.userId,
        input.userWishlistId
      )
    if (!result) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No wishlist items found for this user',
      })
    }

    return result
  })
