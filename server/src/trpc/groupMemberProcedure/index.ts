/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '../authenticatedProcedure'
import provideRepos from '../provideRepos'
import { userEventRepository } from '@server/repositories/userEventRepository'

export const groupMemberProcedure = authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
    })
  )
  .use(async ({ ctx, next, rawInput }) => {
    if (!ctx.repos?.userEventRepository) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'UserEventRepository not provided',
      })
    }

    const input = rawInput as { eventId: number | undefined }
    const eventId = input.eventId || (input as any).id

    if (!eventId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event ID not provided',
      })
    }

    const isMember = await ctx.repos.userEventRepository.isMember(
      eventId,
      ctx.authUser.auth0Id,
     
    )

    if (!isMember) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Event membership not found.',
      })
    }

    return next({
      ctx: {
        ...ctx,
        isMember: true,
      },
    })
  })
