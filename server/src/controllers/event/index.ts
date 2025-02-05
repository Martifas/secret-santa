import { router } from '@server/trpc'
import getEvent from './getEvent'
import createEvent from './createEvent'
import removeEvent from './removeEvent'

export default router({
  getEvent,
  createEvent,
  removeEvent,
})
