import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { hash } from 'bcrypt'
import config from '@server/config'
import { assertError } from '@server/utils/errors'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema.pick({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
    })
  )
  .mutation(async ({ input: user, ctx: { repos } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost)

    const userCreated = await repos.userRepository
      .create({
        ...user,
        email: user.email.toLowerCase(),
        password: passwordHash,
      })

      .catch((error: unknown) => {
        assertError(error)

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
            cause: error,
          })
        }

        throw error
      })

    return `User with ${userCreated.id} created`
  })
