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
    itemName: true,
    description: true,
    url: true,
    price: true,
    priority: true,
    isPurchased: true,
}).partial({
    itemName: true,
    description: true,
    url: true,
    price: true,
    priority: true,
    isPurchased: true,
}))
    .mutation(async ({ input: { id, ...updates }, ctx: { repos, authUser } }) => {
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
            message: 'Not authorized to update this wishlist item',
        });
    }
    const wishlist = await repos.wishlistRepository.update(id, updates);
    return wishlist;
});
