import { router } from '@server/trpc'
import createUserWishlist from './createUserWishlist'
import getUserWishlists from './getUserWishlists'
import getUserWishlist from './getUserWishlist'

export default router({
  createUserWishlist,
  getUserWishlists,
  getUserWishlist
})
