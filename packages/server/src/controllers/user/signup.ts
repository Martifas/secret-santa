import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema, type UserForMember } from '@server/entities/user'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema.pick({
      email: true,
      firstName: true,
      lastName: true,
      auth0Id: true,
      avatarUrl: true,
    }).partial({
      firstName: true,
      lastName: true,
      avatarUrl: true,
    })
  )
  .mutation(
    async ({
      input,
      ctx: { repos },
    }): Promise<UserForMember> => {
      const existingUser = await repos.userRepository.findByEmail(input.email)
      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User with this email already exists',
        })
      }

      const user = await repos.userRepository.create({
        ...input,
        createdAt: new Date(),
        lastLogin: new Date(),
      })

      return user
    }
  )