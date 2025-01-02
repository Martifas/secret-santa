import { authenticatedProcedure } from '@server/auth/aunthenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema, type UserForMember } from '@server/entities/user'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema
      .pick({
        auth0Id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      })
      .partial({
        firstName: true,
        lastName: true,
        avatarUrl: true,
      })
  )
  .mutation(
    async ({ input, ctx: { repos } }): Promise<UserForMember> => {
      const { auth0Id, email, firstName, lastName, avatarUrl } = input
      const profile = firstName || lastName || avatarUrl
        ? { firstName, lastName, avatarUrl }
        : undefined

      return repos.userRepository.findOrCreateFromAuth0(
        auth0Id,
        email,
        profile
      )
    }
  )