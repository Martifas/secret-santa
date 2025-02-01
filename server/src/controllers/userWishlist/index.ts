import { router } from '@server/trpc'
import createUserWishlist from './createUserWishlist'
import updateUserWishlist from './updateUserWishlist'
import getUserWishlists from './getUserWishlists'

export default router({
  createUserWishlist,
  updateUserWishlist,
  getUserWishlists
})
