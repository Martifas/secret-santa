import provideRepos from '../../trpc/provideRepos';
import {} from '../../entities/eventInvitation';
import { invitationRepository } from '../../repositories/invitationRepository';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    invitationRepository,
}))
    .query(async ({ ctx: { repos, authUser } }) => {
    const events = await repos.invitationRepository.findAllForUser(authUser.id);
    return events;
});
