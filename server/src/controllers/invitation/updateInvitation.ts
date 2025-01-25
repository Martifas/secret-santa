import provideRepos from '@server/trpc/provideRepos'
import { invitationRepository } from '@server/repositories/invitationRepository'
import {
  eventInvitationSchema,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
import { TRPCError } from '@trpc/server'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'

export default groupAdminProcedure
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
        status: true,
        expiresAt: true,
      })
      .partial({
        email: true,       
        status: true,
        expiresAt: true,
      })
  )
  .mutation(
    async ({
      input: { id, ...updates },
      ctx: { repos },
    }): Promise<InvitationForMember> => {
      const existingInvitation = await repos.invitationRepository.findById(id)

      if (!existingInvitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      const invitation = await repos.invitationRepository.update(id, updates)
      return invitation
    }
  )
