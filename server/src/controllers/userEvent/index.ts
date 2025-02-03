import { router } from '@server/trpc'
import createMember from './createMember'
import removeMember from './removeMember'
import assignSecretSanta from './assignSecretSanta'
import getUserEvents from './getUserEvents'
import createUserEvent from './createUserEvent'
import removeUserEventForAllMembers from './removeUserEventForAllMembers'
import leaveEvent from './leaveEvent'

export default router({
  createMember,
  removeMember,
  assignSecretSanta,
  getUserEvents,
  createUserEvent,
  removeUserEventForAllMembers,
  leaveEvent
})
