import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
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
      ctx: { repos, authUser },
    }): Promise<InvitationForMember | null> => {
      const isEventMember = await repos.userEventRepository.isMember(
        eventId,
        authUser.id
      )
      if (!isEventMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not a member of this event',
        })
      }

      return repos.invitationRepository.findByEventAndUserId(eventId, userId)
    }
  )
