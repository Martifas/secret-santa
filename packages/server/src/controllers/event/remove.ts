import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'

export default authenticatedProcedure
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
    async ({
      input: { id },
      ctx: { repos, authUser },
    }): Promise<EventForMember> => {
      const event = await repos.eventRepository.find(id)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
      }
      // add for admin too
      if (event.createdBy !== authUser.id) { 
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this event',
        })
      }

      return repos.eventRepository.remove(id)
    }
  )