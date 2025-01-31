import { router } from '../trpc'
import event from './event'
import invitation from './invitation'
import rule from './rule'
import user from './user'
import userEvent from './userEvent'
import userWishlist from './userWishlist'
import wishlist from './wishlist'

export const appRouter = router({
  event,
  wishlist,
  rule,
  user,
  userEvent,
  invitation,
  userWishlist
})

export type AppRouter = typeof appRouter
