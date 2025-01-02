import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { z } from 'zod'
import { type UserForMember } from '@server/entities/user'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    z.object({
      auth0Id: z.string(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ input, ctx: { repos } }): Promise<UserForMember> => {
    const existingUser = await repos.userRepository.findByAuth0Id(input.auth0Id)
    
    if (existingUser) {
      return repos.userRepository.updateLastLogin(existingUser.id)
    }

    return repos.userRepository.create({
      auth0Id: input.auth0Id,
      email: input.email,
      createdAt: new Date(),
      lastLogin: new Date(),
    })
  })