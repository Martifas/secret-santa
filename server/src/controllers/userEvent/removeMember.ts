import provideRepos from '@server/trpc/provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { userEventSchema } from '@server/entities/userEvent'
import { TRPCError } from '@trpc/server'
import { groupAdminProcedure } from '@server/trpc/groupdAdminProcedure'
import { logger } from '@server/logger'

export default groupAdminProcedure
  .use(
    provideRepos({
      userEventRepository,
      invitationRepository,
    })
  )
  .input(
    userEventSchema.pick({
      userId: true,
      eventId: true,
    })
  )
  .mutation(
    async ({ input, ctx: { repos } }): Promise<{ success: boolean }> => {
      if (!input.userId || !input.eventId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Missing required fields: userId and eventId must be provided',
        })
      }
      try {
        const userEvent = await repos.userEventRepository.findByEventAndUserId(
          input.eventId,
          input.userId
        )
        if (!userEvent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User event membership not found',
          })
        }

        const removeUserEventId =
          await repos.userEventRepository.removeUserByEventId(
            input.eventId,
            input.userId
          )
        if (!removeUserEventId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to remove user event membership',
          })
        }

        try {
          await repos.invitationRepository.removeUserByEventId(
            input.eventId,
            input.userId
          )
        } catch (invitationError) {
          logger.warn(
            'Could not remove invitation, but user event was removed successfully:',
            invitationError
          )
        }

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        logger.error('Unexpected error in removeUserFromEvent:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An unexpected error occurred while removing user from event',
          cause: error,
        })
      }
    }
  )
