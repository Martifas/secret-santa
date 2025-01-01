import { router } from '@server/trpc'
import findByEventAndUserId from './findByEventAndUser'
import create from './create'
import update from './update'
import remove from './remove'
import findAllForUser from './findAllForUser'
import findById from './findById'

export default router({
  create,
  remove,
  update,
  findAllForUser,
  findByEventAndUserId,
  findById
})
