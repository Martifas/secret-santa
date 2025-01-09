import { router } from '@server/trpc'
import getWishlist from './getWishlist'
import createWishlist from './createWishlist'
import updateWishlist from './updateWishlist'
import deleteWishlist from './deleteWishlist'

export default router({
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
})
