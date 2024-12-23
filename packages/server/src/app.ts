import express from 'express'
import cors from 'cors'
import type { Database } from './database'

export default function createApp(db: Database) {
  const app = express()

  app.use(cors())
  app.use(express.json())

  
  return app
}
