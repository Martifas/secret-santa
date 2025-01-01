import { router } from '@server/trpc'
import findByEventAndUserId from './findByEventAndUserId'
import create from './create'
import remove from './remove'
import update from './update'
import findById from './findByid'


export default router({
  findByEventAndUserId,
  create,
  remove,
  update,
  findById,
  })