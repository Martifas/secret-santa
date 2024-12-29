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
    eventSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    })
  )
  .mutation(
    async ({
      input,
      ctx: { repos },
    }): Promise<EventForMember> => {
      const event = await repos.eventRepository.create(input)
      return event
    }
  )