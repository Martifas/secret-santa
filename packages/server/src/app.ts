/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import cors from 'cors'
import type { Database } from './database'

const { env } = process

export default function createApp(db: Database) {
  const app = express()
  
  app.use(cors())  

  app.use(express.json())  

  app.get('/authorized', (req, res) => {
    res.send('Secured Resource')
  })

  app.get('/', (req, res) => {
    res.send('Server is running!')
  })

  return app
}