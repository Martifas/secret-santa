import { router } from '@server/trpc'
import createRule from './createRule'
import deleteRule from './deleteRule'
import getEventRules from './getEventRules'
import updateRule from './updateRule'


export default router({
 createRule,
 deleteRule,
 getEventRules,
 updateRule
})
