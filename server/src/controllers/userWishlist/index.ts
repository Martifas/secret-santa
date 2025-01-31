import { router } from '@server/trpc'
import createUserWishlist from './createUserWishlist'
import updateUserWishlist from './updateUserWishlist'


export default router({
  createUserWishlist,
  updateUserWishlist
})
