import provideRepos from '@server/trpc/provideRepos'
import { invitationRepository } from '@server/repositories/invitationRepository'
import {
  eventInvitationSchema,
} from '@server/entities/eventInvitation'
import { TRPCError } from '@trpc/server'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .use(
    provideRepos({
      invitationRepository,
    })
  )
  .input(
    eventInvitationSchema.pick({
      id: true,
      status: true,
    })
  )
  .mutation(
    async ({
      input,
      ctx: { repos },
    }): Promise<number> => {
      const existingInvitation = await repos.invitationRepository.findById(input.id)
      if (!existingInvitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      return repos.invitationRepository.updateStatus(input.id, input.status)
    }
  )