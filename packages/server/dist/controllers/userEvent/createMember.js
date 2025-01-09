import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import provideRepos from '../../trpc/provideRepos';
import { userEventRepository } from '../../repositories/userEventRepository';
import { userEventSchema, } from '../../entities/userEvent';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    userEventRepository,
}))
    .input(userEventSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}))
    .mutation(async ({ input, ctx: { repos, authUser }, }) => {
    const existingMembership = await repos.userEventRepository.findByEventAndUserId(input.eventId, authUser.id);
    if (existingMembership) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is already a member of this event',
        });
    }
    const userEvent = await repos.userEventRepository.create(input);
    return userEvent;
});
