import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { type InvitationForMember } from '@server/entities/eventInvitation'
import { invitationRepository } from '@server/repositories/invitationRepository'

export default authenticatedProcedure
  .use(
    provideRepos({
      invitationRepository,
    })
  )
  .query(
    async ({
      ctx: { repos, authUser },
    }): Promise<InvitationForMember[]> => {
      const events = await repos.invitationRepository.findAllForUser(authUser.id)
      return events
    }
  )