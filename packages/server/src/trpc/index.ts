import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { AuthUser } from '@server/entities/user'
import type { Database } from '@server/database'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Repositories } from '@server/repositories'

// The Context type looks good - AuthUser type matches what we'll get from Auth0
export type Context = {
  db: Database
  req?: Request
  res?: Response
  authUser?: AuthUser  // This matches our Auth0 parseTokenPayload return type
  repos?: Partial<Repositories>
}

export type ContextMinimal = Pick<Context, 'db'>

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts
    if (error.cause instanceof ZodError) {
      const validationError = fromZodError(error.cause)
      return {
        ...shape,
        data: {
          message: validationError.message,
        },
      }
    }
    return shape
  },
})

export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t