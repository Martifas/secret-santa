import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '../authenticatedProcedure'

export const groupMemberProcedure = authenticatedProcedure.use(
  async ({ ctx, next, rawInput }) => {
    if (!ctx.repos?.userEventRepository) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'UserEventRepository not provided',
      })
    }

    const input = rawInput as { eventId: number }

    const isMember = await ctx.repos.userEventRepository.isMember(
      input.eventId,
      ctx.authUser.auth0Id
    )

    if (!isMember) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Event member access required.',
      })
    }

    return next({
      ctx: {
        ...ctx,
        isMember: true,
      },
    })
  }
)
