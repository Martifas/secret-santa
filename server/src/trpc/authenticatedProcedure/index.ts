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

  const authHeader = ctx.req.headers.authorization
  if (!authHeader) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing authorization header',
    })
  }

  const [bearer, token] = authHeader.split(' ')

  if (bearer !== 'Bearer' || !token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid authorization format',
    })
  }

  try {
    const tokenPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    return next({
      ctx: {
        authUser: {
          auth0Id: tokenPayload.sub,
        },
      },
    })
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token format',
    })
  }
})
