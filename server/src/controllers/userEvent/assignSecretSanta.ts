import { userEventSchema } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import assignSantas from '@server/services/assignSantas'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
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
  .mutation(async ({ input, ctx: { repos } }): Promise<string> => {
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
        repos.userEventRepository.updateSecretSanta(member, santa,input.eventId)
      )
    )

    return `Secret santas for all ${assignments.length} members assigned`
  })
