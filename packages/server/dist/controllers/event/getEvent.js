import { eventSchema } from '../../entities/event';
import provideRepos from '../../trpc/provideRepos';
import { eventRepository } from '../../repositories/eventRepository';
import { userRepository } from '../../repositories/userRepository';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    eventRepository,
    userRepository,
}))
    .input(eventSchema.pick({
    id: true,
}))
    .query(async ({ input: { id }, ctx: { repos }, }) => {
    const event = await repos.eventRepository.find(id);
    if (!event) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Event with id ${id} not found`,
        });
    }
    return event;
});
