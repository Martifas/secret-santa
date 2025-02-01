import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userWishlistRepository } from '@server/repositories/userWishlistRepository'
import { userWishlistSchema } from '@server/entities/userWishlist'
import { idSchema } from '@server/entities/shared'
import { z } from 'zod'

export default authenticatedProcedure
  .use(
    provideRepos({
      userWishlistRepository,
    })
  )

  .input(
    z.object({
      id: idSchema,
      updates: userWishlistSchema
        .pick({
          title: true,
          description: true,
        })
        .partial(),
    })
  )
  .mutation(
    async ({ input: { id, updates }, ctx: { repos } }): Promise<number> => {
      const userWishlist = await repos.userWishlistRepository.find(id)
      if (!userWishlist) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Record not found',
        })
      }
      const createdId = await repos.userWishlistRepository.update(id, updates)
      if (!createdId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Error creating wishlist',
        })
      }

      return createdId
    }
  )
