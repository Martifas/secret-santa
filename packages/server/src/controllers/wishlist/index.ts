import { router } from '@server/trpc'
import findByEventAndUserId from './findByEventAndUserId'
import create from './create'
import remove from './remove'
import update from './update'


export default router({
  findByEventAndUserId,
  create,
  remove,
  update,
  })