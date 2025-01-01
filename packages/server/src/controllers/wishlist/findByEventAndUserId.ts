import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlist'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      wishlistRepository,
      userEventRepository,
    })
  )
  .input(
    wishlistSchema.pick({
      eventId: true,
      userId: true,
    })
  )
  .query(
    async ({
      input: { eventId, userId },
      ctx: { repos, authUser },
    }): Promise<WishlistForMember | null> => {
      const isEventMember = await repos.userEventRepository.isMember(
        eventId,
        authUser.id
      )
      if (!isEventMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not a member of this event',
        })
      }

      return repos.wishlistRepository.findByEventAndUserId(eventId, userId)
    }
  )
