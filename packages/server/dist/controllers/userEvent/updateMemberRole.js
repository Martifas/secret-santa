import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import provideRepos from '../../trpc/provideRepos';
import { userEventRepository } from '../../repositories/userEventRepository';
import { userEventSchema } from '../../entities/userEvent';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    userEventRepository,
}))
    .input(userEventSchema.pick({
    id: true,
    role: true,
}))
    .mutation(async ({ input, ctx: { repos, authUser } }) => {
    const userEvent = await repos.userEventRepository.findByEventAndUserId(input.id, authUser.id);
    if (!userEvent) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User event membership not found',
        });
    }
    const isAdmin = await repos.userEventRepository.isEventAdmin(authUser.id, userEvent.eventId);
    if (!isAdmin) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only event admins can update roles',
        });
    }
    return repos.userEventRepository.updateRole(input.id, {
        role: input.role,
    });
});
