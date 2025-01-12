import { router } from '../../trpc';
import getEvent from './getEvent';
import createEvent from './createEvent';
import updateEvent from './updateEvent';
import removeEvent from './removeEvent';
import getUserEvents from './getUserEvents';
export default router({
    getEvent,
    createEvent,
    updateEvent,
    removeEvent,
    getUserEvents,
});
