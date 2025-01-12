import provideRepos from "../../trpc/provideRepos";
import { eventRepository } from '../../repositories/eventRepository';
import { authenticatedProcedure } from "../../trpc/authenticatedProcedure";
export default authenticatedProcedure
    .use(provideRepos({
    eventRepository,
}))
    .query(async ({ ctx: { repos, authUser }, }) => {
    const events = await repos.eventRepository.findAllForUser(authUser.id);
    return events;
});
