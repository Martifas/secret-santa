import { router } from '../../trpc';
import createInvitation from './createInvitation';
import updateInvitation from './updateInvitation';
import getUserInvitations from './getUserInvitations';
import getInvitation from './getInvitation';
import checkInvitation from './checkInvitation';
import deleteInvitation from './deleteInvitation';
export default router({
    createInvitation,
    deleteInvitation,
    updateInvitation,
    getUserInvitations,
    getInvitation,
    checkInvitation,
});
