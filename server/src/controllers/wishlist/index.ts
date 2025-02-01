import { router } from '@server/trpc'
import getWishlist from './getWishlist'
import createWishlist from './createWishlist'
import updateWishlist from './updateWishlist'
import deleteWishlistItem from './deleteWishlistItem'

export default router({
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlistItem,
})
