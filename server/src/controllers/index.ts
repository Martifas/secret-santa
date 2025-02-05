import { router } from '../trpc'
import event from './event'
import invitation from './invitation'
import user from './user'
import userEvent from './userEvent'
import userWishlist from './userWishlist'
import wishlistItem from './wishlistItem'

export const appRouter = router({
  event,
  wishlistItem,
  user,
  userEvent,
  invitation,
  userWishlist,
})

export type AppRouter = typeof appRouter
