import provideRepos from '../../trpc/provideRepos';
import { userEventRepository } from '../../repositories/userEventRepository';
import { invitationRepository } from '../../repositories/invitationRepository';
import { eventInvitationSchema, } from '../../entities/eventInvitation';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    invitationRepository,
    userEventRepository,
}))
    .input(eventInvitationSchema.pick({
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
    return repos.invitationRepository.findByEventAndUserId(eventId, userId);
});
