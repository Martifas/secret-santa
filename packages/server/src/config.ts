import 'dotenv/config'
import { z } from 'zod'

const { env } = process
if (!env.NODE_ENV) env.NODE_ENV = 'development'
env.TZ = 'UTC'

const isTest = env.NODE_ENV === 'test'
const isDevTest = env.NODE_ENV === 'development' || isTest

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),
    auth: z.object({
      tokenKey: z.string().default(() => {
        if (isDevTest) {
          return 'supersecretkey'
        }
        throw new Error('You must provide a TOKEN_KEY in a production env!')
      }),
      expiresIn: z.string().default('7d'),
      passwordCost: z.coerce.number().default(isDevTest ? 6 : 12),
    }),
    auth0: z.object({
      issuerBaseURL: z.string().url(),
      audience: z.string(),
    }),
    database: z.object({
      connectionString: z.string().url(),
    }),
  })
  .readonly()

const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,
  auth: {
    tokenKey: env.TOKEN_KEY,
    expiresIn: env.TOKEN_EXPIRES_IN,
    passwordCost: env.PASSWORD_COST,
  },
  auth0: {
    issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
    audience: env.AUTH0_AUDIENCE,
  },
  database: {
    connectionString: env.DATABASE_URL,
  },
})

export default config

function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }
  return undefined
}