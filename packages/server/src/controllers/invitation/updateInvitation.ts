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
        id: true,
        email: true,
        token: true,
        status: true,
        expiresAt: true,
      })
      .partial({
        email: true,
        token: true,
        status: true,
        expiresAt: true,
      })
  )
  .mutation(
    async ({
      input: { id, ...updates },
      ctx: { repos, authUser },
    }): Promise<InvitationForMember> => {
      const existingInvitation = await repos.invitationRepository.findById(id)

      if (!existingInvitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      if (existingInvitation.userId !== authUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this invitation item',
        })
      }

      const invitation = await repos.invitationRepository.update(id, updates)
      return invitation
    }
  )
