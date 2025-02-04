import { router } from '@server/trpc'
import removeMember from './removeMember'
import assignSecretSanta from './assignSecretSanta'
import getUserEvents from './getUserEvents'
import createUserEvent from './createUserEvent'
import updateWishlistId from './updateWishlistId'
import getUserEvent from './getUserEvent'
import getSantee from './getSantee'

export default router({
  removeMember,
  assignSecretSanta,
  getUserEvents,
  createUserEvent,
  updateWishlistId,
  getUserEvent,
  getSantee
})
