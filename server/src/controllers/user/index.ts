import { router } from '@server/trpc'
import updateProfile from './updateProfile'
import logout from './logout'
import userSync from './userSync'

export default router({
  userSync,
  updateProfile,
  logout,
})
