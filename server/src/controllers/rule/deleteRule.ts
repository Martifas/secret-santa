import provideRepos from '@server/trpc/provideRepos'
import { eventRuleSchema, type RuleForMember } from '@server/entities/eventRule'
import { ruleRepository } from '@server/repositories/ruleRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'

export default groupAdminProcedure
  .use(
    provideRepos({
      ruleRepository,
      userEventRepository,
    })
  )
  .input(
    eventRuleSchema.pick({
      id: true,
      eventId: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<RuleForMember> => {
    const rule = await repos.ruleRepository.remove(input.id)
    return rule
  })
