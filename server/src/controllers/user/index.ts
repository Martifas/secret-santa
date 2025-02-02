import { router } from '@server/trpc'
import updateProfile from './updateProfile'
import logout from './logout'
import userSync from './userSync'
import getUserNameAndPIcByEvent from './getUserNameAndPIcByEvent'

export default router({
  userSync,
  updateProfile,
  logout,
  getUserNameAndPIcByEvent,
})
