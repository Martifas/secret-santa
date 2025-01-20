import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { invitationRepository } from '@server/repositories/invitationRepository'
import {
  eventInvitationSchema,
  type InvitationForMember,
} from '@server/entities/eventInvitation'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'

export default groupAdminProcedure
  .use(
    provideRepos({
      invitationRepository,
      userEventRepository,
    })
  )
  .input(
    eventInvitationSchema.pick({
      eventId: true,
      userId: true,
    })
  )
  .query(
    async ({
      input: { eventId, userId },
      ctx: { repos },
    }): Promise<InvitationForMember | null> => {
      return repos.invitationRepository.findByEventAndUserId(eventId, userId)
    }
  )
