import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { assertError } from '@server/utils/errors'

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(
    userSchema.pick({
      email: true,
      firstName: true,
      lastName: true,
      auth0Id: true,
      picture: true,
    })
  )
  .mutation(async ({ input: userData, ctx: { repos } }) => {
    try {
      let user = await repos.userRepository.findByAuth0Id(userData.auth0Id)

      if (!user) {
        const createdId = await repos.userRepository.create({
          ...userData,
          email: userData.email.toLowerCase(),
          lastLogin: new Date(),
        })
        user = await repos.userRepository.findById(createdId)
        if (!user) throw new Error('Failed to create user')
      } else {
        await repos.userRepository.updateLastLogin(user.id)
      }

      return { success: true, id: user.id }
    } catch (error) {
      assertError(error)
      if (error.message.includes('duplicate key')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User with this email already exists',
          cause: error,
        })
      }
      throw error
    }
  })
