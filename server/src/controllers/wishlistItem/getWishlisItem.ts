import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlistItem'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

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
    return repos.wishlistRepository.findAllByUserIdAndUserWishlistId(
      input.userId,
      input.userWishlistId
    )
  })
