import { eventSchema } from '../../entities/event';
import provideRepos from '../../trpc/provideRepos';
import { eventRepository } from '../../repositories/eventRepository';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    eventRepository,
}))
    .input(eventSchema.omit({
    id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
}))
    .mutation(async ({ input, ctx: { repos, authUser } }) => {
    const event = await repos.eventRepository.create({
        ...input,
        createdBy: authUser.id,
        eventDate: input.eventDate,
    });
    return event;
});
