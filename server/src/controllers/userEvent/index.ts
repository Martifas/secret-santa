import { router } from '@server/trpc'
import createMember from './createMember'
import removeMember from './removeMember'
import updateMemberRole from './updateMemberRole'
import assignSecretSanta from './assignSecretSanta'
import getUserEvents from './getUserEvents'

export default router({
  createMember,
  removeMember,
  updateMemberRole,
  assignSecretSanta,
  getUserEvents
})
