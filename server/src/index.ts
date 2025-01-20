import createApp from './app'
import { createDatabase } from './database'
import config from './config.js'
import { logger } from './logger'

const database = createDatabase(config.database)
const app = createApp(database)

const server = app.listen(config.port, () => {
  logger.info(`Server is running at http://localhost:${config.port}`)
})

const gracefulShutdown = async () => {
  logger.info('Server shutting down...')

  try {
    server.close()
    await database.destroy()
    process.exit(0)
  } catch (error) {
    logger.error('Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  gracefulShutdown()
})
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason)
  gracefulShutdown()
})