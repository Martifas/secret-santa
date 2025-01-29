import { eventSchema } from '@server/entities/event'
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
  .mutation(async ({ input, ctx: { repos, authUser } }): Promise<number> => {
    const createdEventId = await repos.eventRepository.create({
      ...input,
      createdBy: authUser.auth0Id,
      status: 'active',
    })

    const event = await repos.eventRepository.find(createdEventId)
    if (!event) throw new Error('Failed to create event')
    return createdEventId
  })
