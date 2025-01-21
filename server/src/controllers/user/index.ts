import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import updateProfile from './updateProfile'
import logout from './logout'

export default router({
  signup,
  login,
  updateProfile,
  logout,
})
