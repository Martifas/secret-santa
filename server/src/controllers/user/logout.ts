import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export default publicProcedure.mutation(async ({ ctx: { res } }) => {
  if (!res) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing response object',
    })
  }

  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  })

  return { success: true }
})
