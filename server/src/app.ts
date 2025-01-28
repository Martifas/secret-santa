import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import type { Database } from './database'
import { appRouter } from './controllers'
import type { Context } from './trpc'
import config from './config'

export default function createApp(db: Database) {
  const app = express()

  // app.use(
  //   cors({
  //     origin: ['http://giftmeister.eu', 'https://giftmeister.eu'],
  //     credentials: true,
  //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //     allowedHeaders: [
  //       'Authorization',
  //       'Content-Type',
  //       'Accept',
  //       'Origin',
  //       'User-Agent',
  //       'DNT',
  //       'Cache-Control',
  //       'X-Mx-ReqToken',
  //       'Keep-Alive',
  //       'X-Requested-With',
  //       'If-Modified-Since',
  //       'trpc-batch',
  //       'x-trpc-source',
  //     ],
  //   })
  // )

  app.use(express.json())

  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        db,
        req,
        res,
      }),
      router: appRouter,
    })
  )

  if (config.env === 'development') {
    app.get('/api/v1/trpc-panel', (_, res) => {
      res.send(
        renderTrpcPanel(appRouter, {
          url: `http://localhost:${config.port}/api/v1/trpc`,
          transformer: 'superjson',
        })
      )
    })
  }

  return app
}
