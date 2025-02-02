import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { z } from 'zod'
import { assertError } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'
import { idSchema } from '@server/entities/shared'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  .input(
    z.object({
      id: idSchema,
      updates: eventSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
        })
        .partial(),
    })
  )
  .mutation(
    async ({
      input: { id, updates },
      ctx: { repos },
    }): Promise<EventForMember> => {
      const event = await repos.eventRepository.find(id)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
      }

      try {
        const eventUpdated = await repos.eventRepository.update(id, updates)
        return eventUpdated
      } catch (error) {
        assertError(error)
        throw error
      }
    }
  )
