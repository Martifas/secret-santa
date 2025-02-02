import { router } from '@server/trpc'
import updateProfile from './updateProfile'
import logout from './logout'
import userSync from './userSync'
import getUserNamePicEmailByEvent from './getUserNamePicEmailByEvent'

export default router({
  userSync,
  updateProfile,
  logout,
  getUserNamePicEmailByEvent,
})
