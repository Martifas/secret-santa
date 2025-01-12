import provideRepos from '../../trpc/provideRepos';
import { invitationRepository } from '../../repositories/invitationRepository';
import { eventInvitationSchema, } from '../../entities/eventInvitation';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    invitationRepository,
}))
    .input(eventInvitationSchema.pick({
    id: true,
}))
    .query(async ({ input: { id }, ctx: { repos, authUser }, }) => {
    const invitation = await repos.invitationRepository.findById(id);
    if (!invitation) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invitation not found',
        });
    }
    if (invitation.userId !== authUser.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view this invitation',
        });
    }
    return invitation;
});
