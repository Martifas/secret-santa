import provideRepos from '@server/trpc/provideRepos'
import {
  eventInvitationSchema,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { TRPCError } from '@trpc/server'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'

export default groupAdminProcedure
  .use(
    provideRepos({
      invitationRepository,
    })
  )
  .input(
    eventInvitationSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<InvitationForMember> => {
    const existing = await repos.invitationRepository.findByEventAndEmail(
      input.eventId,
      input.email
    )
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message:
          'An invitation with this name already exists for this event and user',
      })
    }

    const invitation = await repos.invitationRepository.create(input)
    return invitation
  })
