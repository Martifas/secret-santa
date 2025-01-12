import provideRepos from '../../trpc/provideRepos';
import { invitationRepository } from '../../repositories/invitationRepository';
import { eventInvitationSchema, } from '../../entities/eventInvitation';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    invitationRepository,
}))
    .input(eventInvitationSchema
    .pick({
    id: true,
    email: true,
    token: true,
    status: true,
    expiresAt: true,
})
    .partial({
    email: true,
    token: true,
    status: true,
    expiresAt: true,
}))
    .mutation(async ({ input: { id, ...updates }, ctx: { repos, authUser }, }) => {
    const existingInvitation = await repos.invitationRepository.findById(id);
    if (!existingInvitation) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invitation not found',
        });
    }
    if (existingInvitation.userId !== authUser.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to update this invitation item',
        });
    }
    const invitation = await repos.invitationRepository.update(id, updates);
    return invitation;
});
