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
    eventInvitationSchema
      .pick({
        email: true,
        status: true,
        eventId: true,
      })
      .partial({
        status: true,
      })
  )
  .mutation(
    async ({
      input: { email, eventId, ...updates },
      ctx: { repos, authUser },
    }): Promise<InvitationForMember> => {
      const existingInvitation =
        await repos.invitationRepository.findByEventAndEmail(eventId, email)
      if (!existingInvitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      const updateData = {
        ...updates,
        userId: authUser.auth0Id,
      }

      const invitation = await repos.invitationRepository.update(
        existingInvitation.id,
        updateData
      )
      return invitation
    }
  )
