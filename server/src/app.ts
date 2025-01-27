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

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://localhost:5173',
        'http://127.0.0.1:5174',
        'https://giftmeister.eu',
        'http://giftmeister.eu',
        'http://localhost:3000',
        'https://localhost:3000',
        'http://localhost',
        'https://localhost',
        'http://localhost:80',
        'https://localhost:80',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'trpc-batch',
        'x-trpc-source',
        'content-type',
        'authorization',
      ],
    })
  )

  app.options('*', cors())

  app.use((req, res, next) => {
    console.log('CORS - Incoming Request:', {
      origin: req.get('origin'),
      host: req.get('host'),
      method: req.method,
      headers: {
        'access-control-request-headers':
          req.headers['access-control-request-headers'],
        'access-control-request-method':
          req.headers['access-control-request-method'],
      },
    })
    next()
  })

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
