import provideRepos from '@server/trpc/provideRepos'
import { wishlistRepository } from '@server/repositories/wishlistRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import {
  wishlistSchema,
  type WishlistForMember,
} from '@server/entities/wishlist'
import { groupMemberProcedure } from '@server/trpc/groupMemberProcedure'

export default groupMemberProcedure
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
      ctx: { repos },
    }): Promise<WishlistForMember | null> => {     

      return repos.wishlistRepository.findByEventAndUserId(eventId, userId)
    }
  )
