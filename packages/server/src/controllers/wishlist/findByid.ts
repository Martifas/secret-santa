import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlist'
import { eventRepository } from '@server/repositories/eventRepository'
import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      wishlistRepository,
      eventRepository,
    })
  )
  .input(
    wishlistSchema.pick({
      id: true,
      eventId: true,
    })
  )
  .query(
    async ({
      input: { id, eventId },
      ctx: { repos, authUser },
    }): Promise<WishlistForMember> => {
      const wishlist = await repos.wishlistRepository.findById(id)

      if (!wishlist) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Wishlist item not found',
        })
      }

      const isEventMember = await repos.eventRepository.isMember(
        eventId,
        authUser.id
      )
      if (!isEventMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not a member of this event',
        })
      }

      return wishlist
    }
  )
