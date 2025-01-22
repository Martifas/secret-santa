import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(
    userSchema.pick({
      auth0Id: true,
    })
  )
  .mutation(async ({ input: { auth0Id }, ctx: { repos } }) => {
    const user = await repos.userRepository.findByAuth0Id(auth0Id)

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return { success: true, user }
  })
