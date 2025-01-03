import provideRepos from '@server/trpc/provideRepos'
import { eventRuleSchema, type RuleForMember } from '@server/entities/eventRule'
import { ruleRepository } from '@server/repositories/ruleRepository'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import { TRPCError } from '@trpc/server'

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
  .mutation(
    async ({ input, ctx: { repos, authUser } }): Promise<RuleForMember> => {
      const isEventAdmin = await repos.userEventRepository.isEventAdmin(
        authUser.id,
        input.eventId
      )
      if (!isEventAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not an admin of this event',
        })
      }
      const rule = await repos.ruleRepository.create(input)
      return rule
    }
  )
