import { router } from '@server/trpc'
import getWishlistItem from './getWishlisItem'
import createWishlistItem from './createWishlistItem'
import deleteWishlistItem from './deleteWishlistItem'

export default router({
  getWishlistItem,
  createWishlistItem,
  deleteWishlistItem,
})
