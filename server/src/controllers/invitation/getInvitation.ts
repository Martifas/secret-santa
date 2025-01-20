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
    eventInvitationSchema.pick({
      id: true,
    })
  )
  .query(
    async ({
      input: { id },
      ctx: { repos },
    }): Promise<InvitationForMember> => {
      const invitation = await repos.invitationRepository.findById(id)

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      return invitation
    }
  )
