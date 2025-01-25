import { eventSchema, type EventForMember } from '@server/entities/event'
import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  .input(
    eventSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .mutation(
    async ({ input, ctx: { repos, authUser } }): Promise<EventForMember> => {
      const event = await repos.eventRepository.create({
        ...input,
        createdBy: authUser.auth0Id,
        eventDate: input.eventDate,
        budgetLimit: input.budgetLimit,
        description: input.description,
        status: 'active',
        name: input.name,
      })
      return event
    }
  )
