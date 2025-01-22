import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema, type UserForMember } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema
      .pick({
        firstName: true,
        lastName: true,
        picture: true,
      })
      .partial()
  )
  .mutation(
    async ({ input, ctx: { repos, authUser } }): Promise<UserForMember> => {
      const user = await repos.userRepository.findByAuth0Id(authUser.auth0Id)
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return repos.userRepository.updateProfile(user.id, input)
    }
  )
