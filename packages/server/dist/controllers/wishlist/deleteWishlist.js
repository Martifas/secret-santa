import provideRepos from '../../trpc/provideRepos';
import { wishlistRepository } from '../../repositories/wishlistRepository';
import { wishlistSchema } from '../../entities/wishlist';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    wishlistRepository,
}))
    .input(wishlistSchema.pick({
    id: true,
}))
    .mutation(async ({ input: { id }, ctx: { repos, authUser } }) => {
    const existingWishlist = await repos.wishlistRepository.findById(id);
    if (!existingWishlist) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Wishlist item not found',
        });
    }
    if (existingWishlist.userId !== authUser.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to remove this wishlist item',
        });
    }
    const wishlist = await repos.wishlistRepository.remove(id);
    return wishlist;
});
