import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlist'
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
  .mutation(async ({ input, ctx: { repos } }): Promise<WishlistForMember> => {
    const existing = await repos.wishlistRepository.findByEventAndUserId(
      input.eventId,
      input.userId
    )
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message:
          'A wishlist item with this name already exists for this event and user',
      })
    }

    const wishlist = await repos.wishlistRepository.create(input)
    return wishlist
  })
