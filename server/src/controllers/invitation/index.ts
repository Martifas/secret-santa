import { router } from '@server/trpc'
import createAndSendInvitation from './createAndSendInvitation'
import updateInvitation from './updateInvitation'
import getInvitation from './getInvitation'
import deleteInvitation from './deleteInvitation'
import getPendingInvitations from './getPendingInvitations'
import updateInvitationStatus from './updateInvitationStatus'

export default router({
  createAndSendInvitation,
  deleteInvitation,
  updateInvitation,
  getInvitation,
  getPendingInvitations,
  updateInvitationStatus,
})
