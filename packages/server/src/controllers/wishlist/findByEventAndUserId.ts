import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { eventRepository } from '@server/repositories/eventRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlist'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
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
      eventId: true,
      userId: true,
    })
  )
  .query(
    async ({
      input: { eventId, userId },
      ctx: { repos, authUser },
    }): Promise<WishlistForMember | null> => {
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

      return repos.wishlistRepository.findByEventAndUserId(eventId, userId)
    }
  )
