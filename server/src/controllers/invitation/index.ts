import { router } from '@server/trpc'
import createAndSendInvitation from './createAndSendInvitation'
import updateInvitation from './updateInvitation'
import getUserInvitations from './getUserInvitations'
import getInvitation from './getInvitation'
import deleteInvitation from './deleteInvitation'

export default router({
  createAndSendInvitation,
  deleteInvitation,
  updateInvitation,
  getUserInvitations,
  getInvitation,
})
