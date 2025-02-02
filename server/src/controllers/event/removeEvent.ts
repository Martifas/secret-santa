import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { eventRepository } from '@server/repositories/eventRepository'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { eventSchema } from '@server/entities/event'
import { TRPCError } from '@trpc/server'
import { groupAdminProcedure } from '@server/trpc/groupdAdminProcedure'

export default groupAdminProcedure
  .use(
    provideRepos({
      userEventRepository,
      eventRepository,
      invitationRepository,
    })
  )
  .input(
    eventSchema.pick({
      id: true,
    })
  )
  .mutation(
    async ({
      input: { id },
      ctx: { repos },
    }): Promise<{ success: boolean }> => {
      const event = await repos.eventRepository.find(id)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
      }

      await repos.invitationRepository.removeByEventId(id)
      await repos.userEventRepository.removeByEventId(id)
      await repos.eventRepository.remove(id)

      return { success: true }
    }
  )
