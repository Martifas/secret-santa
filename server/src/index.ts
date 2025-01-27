import createApp from './app'
import { createDatabase } from './database'
import config from './config.js'
import { logger } from './logger'

const database = createDatabase(config.database)
logger.info('Database initialized')

const app = createApp(database)
const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`)
})

const gracefulShutdown = async () => {
  try {
    await new Promise((resolve) => {
      server.close(resolve)
    })
    await database.destroy()
    logger.info('Database connection closed successfully')
    logger.info('Graceful shutdown completed')
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