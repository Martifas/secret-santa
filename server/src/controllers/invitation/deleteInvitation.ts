import provideRepos from '@server/trpc/provideRepos'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { eventInvitationSchema } from '@server/entities/eventInvitation'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      invitationRepository,
    })
  )
  .input(
    eventInvitationSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { repos } }): Promise<number> => {
    const existingInvitation = await repos.invitationRepository.findById(id)

    if (!existingInvitation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    }

    return await repos.invitationRepository.removeById(id)
  })
