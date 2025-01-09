import provideRepos from '../../trpc/provideRepos';
import { eventRuleSchema } from '../../entities/eventRule';
import { ruleRepository } from '../../repositories/ruleRepository';
import { userEventRepository } from '../../repositories/userEventRepository';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
export default authenticatedProcedure
    .use(provideRepos({
    ruleRepository,
    userEventRepository,
}))
    .input(eventRuleSchema.pick({
    id: true,
    eventId: true
}))
    .mutation(async ({ input, ctx: { repos, authUser }, }) => {
    const isEventAdmin = await repos.userEventRepository.isEventAdmin(authUser.id, input.eventId);
    if (!isEventAdmin) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not an admin of this event',
        });
    }
    const rule = await repos.ruleRepository.remove(input.id);
    return rule;
});
