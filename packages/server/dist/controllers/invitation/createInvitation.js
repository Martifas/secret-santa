import provideRepos from '../../trpc/provideRepos';
import { eventInvitationSchema, } from '../../entities/eventInvitation';
import { invitationRepository } from '../../repositories/invitationRepository';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    invitationRepository,
}))
    .input(eventInvitationSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}))
    .mutation(async ({ input, ctx: { repos } }) => {
    const existing = await repos.invitationRepository.findByEventAndUserId(input.eventId, input.userId);
    if (existing) {
        throw new TRPCError({
            code: 'CONFLICT',
            message: 'An invitation with this name already exists for this event and user',
        });
    }
    const invitation = await repos.invitationRepository.create(input);
    return invitation;
});
