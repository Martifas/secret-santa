import { eventSchema } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { publicProcedure } from '@server/trpc'
import type { EventRowSelect } from '@server/types/event'

export default publicProcedure
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
    }): Promise<EventRowSelect | null> => {
      const event = await repos.eventRepository.find(id)
      return event
    }
  )