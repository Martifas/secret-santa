import provideRepos from '@server/trpc/provideRepos'
import { invitationRepository } from '@server/repositories/invitationRepository'
import {
  eventInvitationSchema,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
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
  .mutation(
    async ({ input: { id }, ctx: { repos } }): Promise<InvitationForMember> => {
      const existingInvitation = await repos.invitationRepository.findById(id)

      if (!existingInvitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      const invitation = await repos.invitationRepository.remove(id)
      return invitation
    }
  )
