import { eventSchema } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import type { EventRowSelect } from '@server/types/event'
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
  .query(
    async ({
      input: { id },
      ctx: { repos },
    }): Promise<EventRowSelect> => {
      const event = await repos.eventRepository.find(id)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Event with id ${id} not found`,
        })
      }
      return event
    }
  )