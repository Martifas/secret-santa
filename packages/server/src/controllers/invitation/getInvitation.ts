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
  .query(
    async ({
      input: { id },
      ctx: { repos, authUser },
    }): Promise<InvitationForMember> => {
      const invitation = await repos.invitationRepository.findById(id)

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      if (invitation.userId !== authUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view this invitation',
        })
      }

      return invitation
    }
  )
