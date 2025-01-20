import createApp from './app'
import { createDatabase } from './database'
import config from './config.js'
import { logger } from './logger'

const database = createDatabase(config.database)
const app = createApp(database)

app.listen(config.port, () => {
  logger.info(`Server is running at http://localhost:${config.port}`)
})