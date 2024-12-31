import { router } from '../trpc'
import event from './event'
import wishlist from './wishlist'

export const appRouter = router({
  event,
  wishlist,
})

export type AppRouter = typeof appRouter
