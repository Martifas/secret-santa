import { router } from '../../trpc';
import createMember from './createMember';
import removeMember from './removeMember';
import updateMemberRole from './updateMemberRole';
export default router({
    createMember,
    removeMember,
    updateMemberRole,
});
