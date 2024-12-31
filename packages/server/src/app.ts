/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import cors from 'cors'
import { auth } from 'express-oauth2-jwt-bearer'
import type { Database } from './database'

const { env } = process

export default function createApp(db: Database) {
  const app = express()
  
  app.use(cors())  

  app.use(express.json())  

  const jwtCheck = auth({
    audience: env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
  })
  app.use(jwtCheck)

  app.get('/authorized', (req, res) => {
    res.send('Secured Resource')
  })

  return app
}