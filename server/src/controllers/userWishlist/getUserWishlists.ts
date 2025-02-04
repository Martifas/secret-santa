import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userWishlistRepository } from '@server/repositories/userWishlistRepository'
import { type UserWishlistForMember } from '@server/entities/userWishlist'

export default authenticatedProcedure
  .use(
    provideRepos({
      userWishlistRepository,
    })
  )
  .query(
    async ({ ctx: { repos, authUser } }): Promise<UserWishlistForMember[]> => {
      const result = await repos.userWishlistRepository.findAllForUser(
        authUser.auth0Id
      )
      if (!result || result.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No wishlists found for this user',
        })
      }

      return result
    }
  )
