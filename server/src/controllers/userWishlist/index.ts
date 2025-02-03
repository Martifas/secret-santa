import { router } from '@server/trpc'
import createUserWishlist from './createUserWishlist'
import updateUserWishlist from './updateUserWishlist'
import getUserWishlists from './getUserWishlists'
import getCurrentWishlist from '../userEvent/getUserEvent'
import getUserWishlist from './getUserWishlist'

export default router({
  createUserWishlist,
  updateUserWishlist,
  getUserWishlists,
  getCurrentWishlist,
  getUserWishlist
})
