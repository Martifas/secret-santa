import { router } from '@server/trpc'
import createMember from './createMember'
import removeMember from './removeMember'
import assignSecretSanta from './assignSecretSanta'
import getUserEvents from './getUserEvents'
import createUserEvent from './createUserEvent'
import removeUserEventForAllMembers from './removeUserEventForAllMembers'
import getSecretSanta from './getSecretSanta'
import updateWishlistId from './updateWishlistId'
import getUserEvent from './getUserEvent'

export default router({
  createMember,
  removeMember,
  assignSecretSanta,
  getUserEvents,
  createUserEvent,
  removeUserEventForAllMembers,
  getSecretSanta,
  updateWishlistId,
  getUserEvent
})
