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
      eventId: true,
      email: true
    })
  )
  .query(
    async ({ input, ctx: { repos } }): Promise<InvitationForMember> => {
      const invitation = await repos.invitationRepository.findByEventAndEmail(input.eventId, input.email)

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      return invitation
    }
  )
