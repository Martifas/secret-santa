import { publicProcedure } from "@server/trpc"
import { TRPCError } from "@trpc/server"

export default publicProcedure
.mutation(async ({ ctx: { res } }) => {
    if (!res) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Missing response object',
      })
    }
  
    res.clearCookie('access_token')
    return { success: true }
  })