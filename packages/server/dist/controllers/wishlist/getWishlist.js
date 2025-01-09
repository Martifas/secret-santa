import provideRepos from '../../trpc/provideRepos';
import { wishlistRepository } from '../../repositories/wishlistRepository';
import { userEventRepository } from '../../repositories/userEventRepository';
import { wishlistSchema, } from '../../entities/wishlist';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    wishlistRepository,
    userEventRepository,
}))
    .input(wishlistSchema.pick({
    eventId: true,
    userId: true,
}))
    .query(async ({ input: { eventId, userId }, ctx: { repos, authUser }, }) => {
    const isEventMember = await repos.userEventRepository.isMember(eventId, authUser.id);
    if (!isEventMember) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not a member of this event',
        });
    }
    return repos.wishlistRepository.findByEventAndUserId(eventId, userId);
});
