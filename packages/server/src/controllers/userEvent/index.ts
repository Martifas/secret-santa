import { router } from '@server/trpc'
import create from './create'
import remove from './remove'
import isMember from './isMember'
import isEventAdmin from './isEventAdmin'
import updateRole from './updateRole'
import findByEventAndUserId from './findByEventAndUserId'

export default router({
    create,
    remove,
    isMember,
    isEventAdmin,
    updateRole,
    findByEventAndUserId
})