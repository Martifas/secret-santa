/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'
import { parseTokenPayload } from '@server/trpc/tokenPayload'
import { publicProcedure } from '..'

const { tokenKey } = config.auth

function verify(token: string) {
  return jsonwebtoken.verify(token, tokenKey)
}

function getUserFromToken(token: string) {
  try {
    const tokenVerified = verify(token)
    const tokenParsed = parseTokenPayload(tokenVerified)
    return {
      user: tokenParsed.user,
      exp: (tokenVerified as any).exp,
    }
  } catch (error) {
    return null
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

  const tokenData = getUserFromToken(token)
  if (!tokenData) {
     ctx.res.clearCookie('access_token')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token.',
    })
  }

  const expiresIn = tokenData.exp - Math.floor(Date.now() / 1000)
  if (expiresIn < 120) {
    const newToken = jsonwebtoken.sign(
      { user: tokenData.user },
      tokenKey,
      { expiresIn: '15m' }
    )

    ctx.res.cookie('access_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
  }

  return next({
    ctx: {
      authUser: tokenData.user,
    },
  })
})