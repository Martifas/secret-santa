import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { TRPCError } from '@trpc/server'
import { groupAdminProcedure } from '@server/trpc/groupAdminProcedure'

export default groupAdminProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  .input(
    eventSchema.pick({
      id: true,
    })
  )
  .mutation(
    async ({ input: { id }, ctx: { repos } }): Promise<EventForMember> => {
      const event = await repos.eventRepository.find(id)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
      }

      return repos.eventRepository.remove(id)
    }
  )
