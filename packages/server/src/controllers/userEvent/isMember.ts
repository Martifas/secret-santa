import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { userEventSchema } from '@server/entities/userEvent'

export default authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .input(userEventSchema.pick({eventId: true}))
  .query(
    async ({ input, ctx: { repos, authUser } }): Promise<boolean> => repos.userEventRepository.isMember(
        input.eventId,
        authUser.id,
      )
  )