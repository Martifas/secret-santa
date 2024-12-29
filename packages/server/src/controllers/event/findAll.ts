import { publicProcedure } from "@server/trpc"
import provideRepos from "@server/trpc/provideRepos"
import { eventRepository } from '@server/repositories/eventRepository'
import type { EventRowSelect } from "@server/types/event"

export default publicProcedure
  .use(
    provideRepos({
      eventRepository,
    })
  )
  
  .query(
    async ({
      ctx: { repos },
    }): Promise<EventRowSelect[]> => {
      const events = await repos.eventRepository.findAll()
      return events
    }
  )