/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import { publicProcedure } from '..'

declare module 'express' {
  interface Request {
    oidc?: {
      isAuthenticated: () => boolean
      user?: any
    }
  }
}

export const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (ctx.authUser) {
    return next({
      ctx: {
        authUser: ctx.authUser,
      },
    })
  }

  if (!ctx.req || !ctx.res) {
    const message =
      config.env === 'development' || config.env === 'test'
        ? 'Missing Express request object. If you are running tests, make sure to provide some req object in the procedure context.'
        : 'Missing Express request object.'

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message,
    })
  }

  const token = ctx.req.cookies.access_token

  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthenticated. Please log in.',
    })
  }

  if (!ctx.req.oidc?.isAuthenticated()) {
    ctx.res.clearCookie('access_token')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token.',
    })
  }

  return next({
    ctx: {
      authUser: ctx.req.oidc?.user,
    },
  })
})
