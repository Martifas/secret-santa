import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '../authenticatedProcedure'

export const groupAdminProcedure = authenticatedProcedure.use(
  async ({ ctx, next, rawInput }) => {
    if (!ctx.repos?.userEventRepository) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'UserEventRepository not provided',
      })
    }

    const input = rawInput as { eventId: number }

    const isAdmin = await ctx.repos.userEventRepository.isEventAdmin(
      ctx.authUser.auth0Id,
      input.eventId
    )

    if (!isAdmin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Admin access required.',
      })
    }

    return next({
      ctx: {
        ...ctx,
        isEventAdmin: true,
      },
    })
  }
)
