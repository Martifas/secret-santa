import { userEventSchema } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'
import provideRepos from '@server/trpc/provideRepos'
import assignSantas from '@server/utils/assignSantas'
import { TRPCError } from '@trpc/server'

export default groupAdminProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(
    userEventSchema.pick({
      eventId: true,
    })
  )
  .query(async ({ input, ctx: { repos } }): Promise<string> => {
    const eventMembers = await repos.userEventRepository.getAllEventUsers(
      input.eventId
    )

    if (eventMembers.length < 3) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Not enough members to assign secret santas. Minimum 3 members required.',
      })
    }

    const assignments = await assignSantas(eventMembers)

    await Promise.all(
      assignments.map(({ member, santa }) =>
        repos.userEventRepository.updateSecretSanta(member, santa)
      )
    )

    return `Secret santas for all ${assignments.length} members assigned`
  })
