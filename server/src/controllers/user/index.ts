import { router } from '@server/trpc'

import userSync from './userSync'
import getUserNamePicEmailByEvent from './getUserNamePicEmailByEvent'

export default router({
  userSync,
  getUserNamePicEmailByEvent,
})
