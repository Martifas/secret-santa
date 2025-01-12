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
    .input(eventRuleSchema
    .pick({
    id: true,
    eventId: true,
    ruleType: true,
    ruleData: true,
})
    .partial({
    ruleType: true,
    ruleData: true,
}))
    .mutation(async ({ input: { id, eventId, ...updates }, ctx: { repos, authUser } }) => {
    const isEventAdmin = await repos.userEventRepository.isEventAdmin(authUser.id, eventId);
    if (!isEventAdmin) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not an admin of this event',
        });
    }
    const rule = await repos.ruleRepository.update(id, updates);
    return rule;
});
