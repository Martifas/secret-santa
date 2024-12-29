import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { publicProcedure } from '@server/trpc'
import { z } from 'zod'
import { assertError } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'
import { idSchema } from '@server/entities/shared'

export default publicProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  .input(
    z.object({
      id: idSchema,
      updates: eventSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true
      }).partial()
    })
  )
  .mutation(
    async ({
      input: { id, updates },
      ctx: { repos },
    }): Promise<EventForMember> => {
      try {
        const eventUpdated = await repos.eventRepository.update(id, updates)
        return eventUpdated
      } catch (error) {
        assertError(error)
        if (error.message.includes('no result')) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Event not found',
          })
        }
        throw error
      }
    }
  )