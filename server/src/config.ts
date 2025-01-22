import 'dotenv/config'
import { z } from 'zod'

const { env } = process
if (!env.NODE_ENV) env.NODE_ENV = 'development'
env.TZ = 'UTC'

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),
    baseUrl: z.string().url().optional(),
    auth: z.object({
      issuerBaseUrl: z.string().url(),
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      secret: z.string().optional(),
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
  baseUrl: env.BASE_URL,
  auth: {
    issuerBaseUrl: env.AUTH0_ISSUER_BASE_URL,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    secret: env.AUTH0_SECRET,
  },
  database: {
    connectionString: env.DATABASE_URL || '',
  },
})

export default config

function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }
  return undefined
}
