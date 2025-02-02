import provideRepos from '@server/trpc/provideRepos'
import {
  eventInvitationSchema,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
import { invitationRepository } from '@server/repositories/invitationRepository'
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
    })
  )
  .query(async ({ input, ctx: { repos } }): Promise<InvitationForMember[]> => {
    const pendingInvitations =
      await repos.invitationRepository.findPendingInvitationsForEvent(
        input.eventId
      )
    return pendingInvitations
  })
