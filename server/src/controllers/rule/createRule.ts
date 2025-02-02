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
    eventRuleSchema.pick({
      eventId: true,
      ruleType: true,
      ruleData: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<RuleForMember> => {
    const rule = await repos.ruleRepository.create(input)
    return rule
  })
