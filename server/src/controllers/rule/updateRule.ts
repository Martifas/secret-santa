import provideRepos from '@server/trpc/provideRepos'
import { eventRuleSchema, type RuleForMember } from '@server/entities/eventRule'
import { ruleRepository } from '@server/repositories/ruleRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      ruleRepository,
      userEventRepository,
    })
  )
  .input(
    eventRuleSchema
      .pick({
        id: true,
        eventId: true,
        ruleType: true,
        ruleData: true,
      })
      .partial({
        ruleType: true,
        ruleData: true,
      })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<RuleForMember> => {
    const updates = {
      ...(input.ruleType && { ruleType: input.ruleType }),
      ...(input.ruleData && { ruleData: input.ruleData }),
    }

    const rule = await repos.ruleRepository.update(input.id, updates)
    return rule
  })
