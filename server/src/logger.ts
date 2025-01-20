process.env.TZ = 'Europe/Kiev'
import pino from 'pino'

export const logger = pino({
  base: null,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss Z',
          colorize: true,
        },
      },
    ],
  },
})
