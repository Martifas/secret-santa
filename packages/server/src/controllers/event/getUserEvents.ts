import provideRepos from '@server/trpc/provideRepos'
import { eventRepository } from '@server/repositories/eventRepository'
import type { EventRowSelect } from '@server/types/event'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  .query(async ({ ctx: { repos, authUser } }): Promise<EventRowSelect[]> => {
    const events = await repos.eventRepository.findAllForUser(authUser.id)
    return events
  })
