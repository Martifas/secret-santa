import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { publicProcedure } from '@server/trpc'

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
    }): Promise<EventForMember> => {
      const event = await repos.eventRepository.remove(id)
      return event
    }
  )