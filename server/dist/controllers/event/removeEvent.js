import { eventSchema } from '../../entities/event';
import provideRepos from '../../trpc/provideRepos';
import { eventRepository } from '../../repositories/eventRepository';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    eventRepository,
}))
    .input(eventSchema.pick({
    id: true,
}))
    .mutation(async ({ input: { id }, ctx: { repos, authUser }, }) => {
    const event = await repos.eventRepository.find(id);
    if (!event) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Event not found',
        });
    }
    if (event.createdBy !== authUser.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to delete this event',
        });
    }
    return repos.eventRepository.remove(id);
});
