import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userWishlistRepository } from '@server/repositories/userWishlistRepository'
import {
  userWishlistSchema,
  type UserWishlistForMember,
} from '@server/entities/userWishlist'

export default authenticatedProcedure
  .use(
    provideRepos({
      userWishlistRepository,
    })
  )
  .input(
    userWishlistSchema.pick({
      id: true,
    })
  )
  .query(
    async ({input, ctx: { repos } }): Promise<UserWishlistForMember> => {
      const result = await repos.userWishlistRepository.find(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No wishlists found for this user',
        })
      }

      return result
    }
  )
