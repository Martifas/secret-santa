import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import { wishlistSchema, } from '../../entities/wishlist';
import { wishlistRepository } from '../../repositories/wishlistRepository';
import provideRepos from '../../trpc/provideRepos';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    wishlistRepository,
}))
    .input(wishlistSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}))
    .mutation(async ({ input, ctx: { repos } }) => {
    const existing = await repos.wishlistRepository.findByEventAndUserId(input.eventId, input.userId);
    if (existing) {
        throw new TRPCError({
            code: 'CONFLICT',
            message: 'A wishlist item with this name already exists for this event and user',
        });
    }
    const wishlist = await repos.wishlistRepository.create(input);
    return wishlist;
});
