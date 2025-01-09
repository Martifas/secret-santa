import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import provideRepos from '../../trpc/provideRepos';
import { userEventRepository } from '../../repositories/userEventRepository';
import { userEventSchema, } from '../../entities/userEvent';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    userEventRepository,
}))
    .input(userEventSchema.pick({
    id: true,
}))
    .mutation(async ({ input, ctx: { repos, authUser }, }) => {
    const userEvent = await repos.userEventRepository.findByEventAndUserId(input.id, authUser.id);
    if (!userEvent) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User event membership not found',
        });
    }
    const isAdmin = await repos.userEventRepository.isEventAdmin(authUser.id, userEvent.eventId);
    if (!isAdmin && userEvent.userId !== authUser.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to remove this membership',
        });
    }
    return repos.userEventRepository.remove(input.id);
});
